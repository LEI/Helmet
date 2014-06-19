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

	var errorCount = 0;

	$scope.init = function() {
		// Initialisation de la position
		$rootScope.loading.position = true;
		$rootScope.message = 'Géolocalisation...';
		$rootScope.waitPosition = $geolocation.getCurrentPosition({
			timeout: 30000,
			enableHighAccuracy: true,
			maximumAge: 30000
		}).then(function(position) {
			errorCount = 0;
			$scope.startPos = position;
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
			if (errorCount > 10) {
				alert(error);
			} else {
				errorCount++;
				$timeout($scope.init, 1000);
			}
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

	$scope.watchLocation = function() {
		// watchPosition
		$rootScope.loading.position = true;
		$geolocation.watchPosition({
			timeout: 30000,
			enableHighAccuracy: false,
			maximumAge: 30000
		}).then(function(position) {
			$rootScope.loading.position = false;
			// resolve
		}, function(error) {
			$rootScope.loading.position = false;
			// reject
			$rootScope.message = error+'...';
			if (errorCount > 10) {
				alert(error);
			} else {
				errorCount++;
				$timeout($scope.watchLocation, 1000);
			}
		}, function(newPos) {
			errorCount = 0;
			$rootScope.loading.position = false;
			// notify
			$scope.startPos = ($scope.startPos === undefined) ? $rootScope.position || newPos : $scope.startPos;
			// console.log($scope.startPos);
			// console.log($rootScope.position);
			// console.log(newPos);
			$scope.prevPos = $rootScope.position || newPos;
			$rootScope.position = newPos;

			// Calcul de la distance depuis le point de départ
			$rootScope.distance = $geolocation.calculateDistance($scope.startPos, newPos);
			// Calcul de la vitesse
			$rootScope.speed = $geolocation.calculateSpeed($scope.prevPos, newPos);

			//console.log('Distance: ' + $rootScope.distance + '\nVitesse: ' + $rootScope.speed);

			$scope.updateSpeedGraph($rootScope.speed.toFixed(2));
		});
	};

	$scope.clearLocation = function() {
		$geolocation.clearWatch();
		$scope.location = false;
		//console.log($scope.speedGraph);
		//$scope.speedGraph = [];
	};

	// Affiche un itinéraire
	$rootScope.destination = '';
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

		var rand = Math.floor( Math.random() * 10 );
		$scope.updateSpeedGraph(key+rand, true);

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
			if ($rootScope.$storage.position === undefined) {
				$rootScope.$storage.position = {};
			}
			if (key == 0) {
				$scope.startPos = {
					coords: {
						latitude: $scope.step.current.start_point.k,
						longitude: $scope.step.current.start_point.A
					}
				};
				$rootScope.$storage.position.start = $scope.startPos;
			}
			if (key+1 == $scope._steps.length) {
				//TextToSpeech.say('Bien joué !');
				$scope.endPos = {
					coords: {
						latitude: $scope.step.current.end_point.k,
						longitude: $scope.step.current.end_point.A
					}
				};
				$rootScope.$storage.position.start = $scope.endPos;
				$scope.saveTrip();
			}
		}
	};

	$scope.saveTrip = function() {
		FileSystem.write({
			destination: $rootScope.destination,
			direction: $scope._directions,
			speedGraph: $scope.speedGraph,
			date: moment(),
			start: {
				coords: {
					latitude: $scope.startPos.coords.latitude,
					longitude: $scope.startPos.coords.longitude
				}
			},
			end: {
				coords: {
					latitude: $scope.endPos.coords.latitude,
					longitude: $scope.endPos.coords.longitude
				}
			}
		});
	};

	// Efface l'itinéraire
	$scope.resetDirection = function() {
		$scope.resetStorage();
		$scope.clearDirection();
		$scope.initSpeedGraph();
		$timeout(function() {
		    $scope.$apply(function() {
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
		    $scope.$apply(function() {
				$rootScope.message = '';
				$rootScope.destination = '';
				$scope._directions = undefined;
				//$rootScope.accuracy = undefined;
				//$rootScope.distance = undefined;
				$scope.clearSteps();
			});
		});
	};

	$scope.$on('$destroy', function() {
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
				labels: [],
				datasets: [
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,1)",
						pointColor : "rgba(151,187,205,1)",
						pointStrokeColor : "#fff",
						data : []
					}
				]
			}
		};
	};

	$scope.updateSpeedGraph = function(speed, random) {
		var now = moment().format('hh:mm:ss'),
			data = $scope.speedGraph.data;
		data.labels.push(now+(random ?'*':''));
		data.datasets[0].data.push(speed);

		$scope.speedGraph = {
			data: data,
			options: $scope.speedGraph.options
		};
	};

	$scope.initStorage = function() {
		// Local Storage : restitution du dernier itinéraire et de l'étape en cours
		$rootScope.$storage = $localStorage;
		if ($rootScope.$storage.position !== undefined) {
			$scope.startPos = $rootScope.$storage.position.start;
			$scope.endPos = $rootScope.$storage.position.end;
		}
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
		if ($rootScope.$storage.position)
			delete $rootScope.$storage.position;
		if ($rootScope.$storage.destination)
			delete $rootScope.$storage.destination;
		if ($rootScope.$storage.direction)
			delete $rootScope.$storage.direction;
		if ($rootScope.$storage.step)
			delete $rootScope.$storage.step;
	};

	$scope.init();

}]);