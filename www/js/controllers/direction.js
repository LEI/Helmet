'use strict';

angular.module('helmetApp')

/*
*	Itinéraire
*/
.controller('DirectionController', [
	'$scope',
	'$rootScope',
	'$window',
	'$timeout',
	'$filter',
	'$localStorage',
	'$geolocation',
	'$direction',
	'FileSystem',
	'TextToSpeech',
	'SpeechRecognition',
function($scope, $rootScope, $window, $timeout, $filter, $localStorage, $geolocation, $direction, FileSystem, TextToSpeech, SpeechRecognition) {

	// TODO
	//FileSystem.read();

	$scope.init = function() {
		// Initialisation de la position
		$rootScope.loading.position = true;
		$rootScope.message = 'Géolocalisation...';
		$rootScope.waitPosition = $geolocation.getCurrentPosition({
			timeout: 30000,
			enableHighAccuracy: true,
			maximumAge: 30000
		}).then(function(position) {
			startPos = position;
			$rootScope.position = position;
			$rootScope.loading.position = false;
			$rootScope.message = '';
			/*$timeout(function() {
				$direction.initMap(position);
			});*/
			if (position.coords.speed) {
				$rootScope.speed = position.coords.speed;
			}
		}, function(error) {
			$rootScope.loading.position = false;
			$rootScope.message = error;
			console.log(error);
			$timeout($scope.init);
		});
		// Audio
		$rootScope.audio = {
			textToSpeech: false
		};

		$scope.initStorage();
		$scope.initSpeedGraph();
	};

	$scope.start = function() {
		$scope.watchLocation();
		$scope.location = true;
		$scope.getStep(0);
	};

	var startPos, prevPos;
	$scope.watchLocation = function() {
		// watchPosition
		$rootScope.loading.position = true;
		$geolocation.watchPosition({
			timeout: 30000,
			enableHighAccuracy: false,
			maximumAge: 30000
		}).then(function(position) {
			// resolve
		}, function(error) {
			// reject
			$rootScope.message = error+'...';
			alert('La position n\'est plus observée');
		}, function(newPos) {
			// notify
			$rootScope.loading.position = false;
			if ($rootScope.position !== undefined) {
				prevPos = $rootScope.position;
			} else {
				prevPos = startPos;
			}
			$rootScope.position = newPos;
			// Calcul de la distance depuis le point de départ
			$rootScope.distance = $geolocation.calculateDistance(
				prevPos.coords.latitude, prevPos.coords.longitude,
				newPos.coords.latitude, newPos.coords.longitude) * 1000;
			// Vitesse
			var timeDelta = (newPos.timestamp - prevPos.timestamp) * 3.6,
				speed = $rootScope.distance / timeDelta * 1000;
			// (1 m / 60 secs * 3.6) * 1000 = 60 km/h
			console.log('Distance: ' + $rootScope.distance);

			//$scope.updateSpeedGraph(speed || 0, (prevPos.timestamp - startPos.timestamp));

			if (!isNaN(speed) && speed !== 0) {
				console.log('~Vitesse: ' + speed);
			}
			if (newPos.coords.speed !== null) {
				$rootScope.speed = newPos.coords.speed;
				alert( 'Vitesse: ' + newPos.coords.speed );
			}

			// Affichage du point sur la carte
			//$direction.updatePositionMarker(newPos);
			//console.log(JSON.stringify(newPos,null,4));
		});
	};

	$scope.clearLocation = function() {
		$geolocation.clearWatch();
		$scope.location = false;
		//console.log($scope.speedGraph);
		//$scope.speedGraph = [];
	};

	// Affiche un itinéraire
	$scope.getDirection = function(destination) {
		$rootScope.loading.direction = true;
		// Attente de la position
		$rootScope.waitPosition.then(function() {
			if (destination !== undefined) {
				$rootScope.destination = destination;
				// Recherche de l'itinéraire
				$direction.getDirection(
					$rootScope.position,
					$rootScope.destination
				).then(function(direction) {
					$rootScope.loading.direction = false;
					// Initialisation de l'itinéraire
					$scope.clearSteps();
					$scope._directions = direction;
					// Sauvegarde l'itinéraire
					$rootScope.$storage.destination = destination;
					$rootScope.$storage.direction = direction;
					$rootScope.message = '';
					// Affichage carte
					//$direction.displayDirection(direction);
				}, function(error) {
					$rootScope.loading.direction = false;
					$rootScope.message = error;
				});
			} else {
				$rootScope.loading.direction = false;
				$rootScope.message = 'Renseignez une destination';
			}
		});
	};

	// Affiche une étape de l'itinéraire
	$scope.getStep = function(key) {
		$scope.updateSpeedGraph(key);
		if ($scope._directions !== undefined) {
			$scope._steps = $scope._directions.routes[0].legs[0].steps;
			if (key >= 0 && key <= $scope._steps.length) {
				$scope.step = {};
				$scope.step.current = $scope._steps[ key ];
				$scope.step.count = key;
				// Sauvegarde de l'étape
				$rootScope.$storage.step = $scope.step;
				// Affichage carte
				//$direction.fitStep($scope.step.current);
				// Escape HTML
				var instruction = $direction.getInstruction($scope.step);
				// Synthèse vocale
				TextToSpeech.say(instruction).then(function(end) {
					console.log(end);
				});

			}
			if (key+1 == $scope._steps.length) {
				TextToSpeech.say('Bien joué !');
			}
		}
	};

	// Efface l'itinéraire
	$scope.resetDirection = function() {
		$scope.resetStorage();
		$scope.clearDirection();
		$scope.initSpeedGraph();
		$timeout(function() {
		    $scope.$apply(function () {
				$rootScope.accuracy = undefined;
				$rootScope.distance = undefined;
			});
		});
		//directionsDisplay.setMap(null);
		//$direction.initMap($rootScope.position);
	};

	$scope.clearDirection = function() {
		$scope.clearLocation();
		$timeout(function() {
		    $scope.$apply(function () {
				$rootScope.message = '';
				$rootScope.destination = '';
				$scope._directions = undefined;
				//$rootScope.accuracy = undefined;
				//$rootScope.distance = undefined;
				$scope.clearSteps();
			});
		});
	};

	$scope.$on('$destroy', function () {
		$scope.clearDirection();
	});

	// Réinitialise les étapes
	$scope.clearSteps = function() {
		$scope._steps = undefined;
		if ($scope.step === undefined)
			$scope.step = {};
		$scope.step.current = undefined;
		$scope.step.count = -1;
	};

	// Active ou désactive la synthèse vocale
	$scope.toggleVoice = function() {
		TextToSpeech.active = !TextToSpeech.active;
		$rootScope.audio.textToSpeech = TextToSpeech.active;
	};

	$scope.initSpeedGraph = function() {
		$scope.speedGraph = {
			options: {
				width: $window.innerWidth - 100
			},
			data: {
				labels: [0],
				datasets: [
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,1)",
						pointColor : "rgba(151,187,205,1)",
						pointStrokeColor : "#fff",
						data : [0]
					}
				]
			}
		};
	};

	$scope.updateSpeedGraph = function(speed, time) {
		var data = $scope.speedGraph.data;
		data.labels.push( $scope.speedGraph.data.labels.length + 1 ); // time
		data.datasets[0].data.push(speed);

		$scope.speedGraph = {
			data: data,
			options: $scope.speedGraph.options
		};
	};

	$scope.initStorage = function() {
		// Local Storage : restitution du dernier itinéraire et de l'étape en cours
		$rootScope.$storage = $localStorage;
		if ($rootScope.$storage.destination !== undefined) {
			$rootScope.destination = $rootScope.$storage.destination;
		}
		if ($rootScope.$storage.direction !== undefined) {
			$scope._directions = $rootScope.$storage.direction;
			$scope._steps = $scope._directions.routes[0].legs[0].steps;
		}
		if ($rootScope.$storage.step !== undefined) {
			$scope.step = $rootScope.$storage.step;
		}
	};

	$scope.resetStorage = function() {
		//$localStorage.$reset();
		if ($rootScope.$storage.destination)
			delete $rootScope.$storage.destination;
		if ($rootScope.$storage.direction)
			delete $rootScope.$storage.direction;
		if ($rootScope.$storage.step)
			delete $rootScope.$storage.step;
	};

	$scope.init();

}]);