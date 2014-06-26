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
	'$bluetooth',
	'FileSystem',
	'TextToSpeech',
	'SpeechRecognition',
function($scope, $rootScope, $window, $timeout, $filter, $localStorage, $geolocation, $direction, $bluetooth, FileSystem, TextToSpeech, SpeechRecognition) {

	var errorCount = 0;

	$scope.init = function() {
		// Initialisation de la position
		if ($rootScope.position === undefined) {
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
			}, function(error) {
				$rootScope.loading.position = false;
				$rootScope.message = error;
				if (errorCount > 10) {
					alert(error);
				} else {
					errorCount++;
					$timeout(function(){
						$scope.init();
					}, 3000);
				}
			});
		}
		// Audio
		$rootScope.audio = {
			textToSpeech: false
		};

		$scope.initStorage();
		$scope.initSpeedGraph();

		$geolocation.observeId().then(null, null, function(value){
			$timeout(function(){
				$scope.$apply(function(){
					$scope.location = value;
				});
			});
		})
	};

	$scope.start = function() {
		$scope.watchLocation();
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
			// resolve
		}, function(error) {
			$rootScope.loading.position = false;
			// reject
			console.log(error);
			$rootScope.message = error+'...';
			if (errorCount > 1) {
				alert(error);
			} else {
				errorCount++;
				$timeout($scope.watchLocation, 3000);
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
					$scope.goBack($scope.resetDirection);
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
			if (key >= 0 && key <= $scope._directions.routes[0].legs[0].steps.length) {
				$scope.step = {};
				$scope.step.current = $scope._directions.routes[0].legs[0].steps[ key ];
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
			if (key+1 == $scope._directions.routes[0].legs[0].steps.length) {
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
		$scope.location = false;
		$scope.resetStorage();
		$scope.clearDirection();
		$scope.initSpeedGraph();
		$timeout(function() {
		    $scope.$apply(function() {
				$rootScope.accuracy = undefined;
				$rootScope.distance = undefined;
				$rootScope.speed = undefined;
				$scope.clearSteps();
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
			});
		});
	};

	$scope.$on('$destroy', function() {
		$scope.clearDirection();
	});

	// Réinitialise les étapes
	$scope.clearSteps = function() {
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
			labels: [],
			datasets: [
				{
					fillColor : "rgba(255,69,0,0.5)",
					strokeColor : "#ff4500",
					pointColor : "#ff4500",
					pointStrokeColor : "#fff",
					data : []
				}
			]
		};
	};

	$scope.updateSpeedGraph = function(speed, random) {
		var now = moment().format('hh:mm:ss');
		$scope.speedGraph.labels.push(now+(random ?'*':''));
		$scope.speedGraph.datasets[0].data.push(speed);

		$bluetooth.write(speed + 'km/h');
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

			$scope.goBack($scope.resetDirection);
		}
		if ($rootScope.$storage.step !== undefined) {
			$scope.step = $rootScope.$storage.step;

			$scope.watchLocation();
			$scope.location = true;
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