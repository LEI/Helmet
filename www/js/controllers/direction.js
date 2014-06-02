'use strict';

angular.module('helmetApp')

/*
*	Itinéraire
*/
.controller('DirectionController', [
	'$rootScope',
	'$scope',
	'$timeout',
	'$filter',
	'$geolocation',
	'$direction',
	'TextToSpeech',
	'SpeechRecognition',
	function($rootScope, $scope, $timeout, $filter, $geolocation, $direction, TextToSpeech, SpeechRecognition) {
		if ('google' in window) {
			var directionsDisplay = new google.maps.DirectionsRenderer();
		}
		var distance, startPos;
		$rootScope.loading.position = true;
		$rootScope.message = 'Géolocalisation...';

		// getCurrentPosition
		$rootScope.waitPosition = $geolocation.getCurrentPosition({
			timeout: 30000,
			enableHighAccuracy: true,
			maximumAge: 30000
		}).then(function(position) {
			$rootScope.position = position;
			startPos = position;
			$rootScope.loading.position = false;
			$rootScope.message = '';
			$timeout(function() {
				$direction.initMap(position); // $direction undefined ?
			});
			if (position.coords.speed) {
				$rootScope.speed = position.coords.speed;
			}
		}, function(error) {
			console.log(error);
			$rootScope.message = 'Position inconnue';
		});

		$scope.startWatch = function() {
			// watchPosition
			$geolocation.watchPosition({
				timeout: 30000
			}).then(function(position) {
				$rootScope.loading.position = false;
				$rootScope.position = position;

				if (position.coords.speed) {
					$rootScope.speed = position.coords.speed;
				}

				distance = $geolocation.calculateDistance(
					startPos.coords.latitude, startPos.coords.longitude,
					position.coords.latitude, position.coords.longitude);
				$rootScope.distance = '(' + (distance * 1000).toFixed(2) + ' m)';

				console.log('Position mise à jour !');

			}, function(error) {
				alert(error);
				$rootScope.message = 'Position inconnue...';
			}, function(update) {
				console.log(update);
				$direction.locateMe(update);
			});
		};

		$scope.stopWatch = function() {
			$geolocation.clearWatch();
		};

		$scope.findMe = function(position) {
			$scope.startWatch();
		};

		// Affiche un itinéraire
		$scope.getDirection = function(destination) {
			$rootScope.loading.direction = true;
			// Attente de la position
			$rootScope.waitPosition.then(function() {
				if (destination !== undefined) {
					$rootScope.destination = destination;
					// Recherche de l'itinéraire
					$direction.getDirections(
						$rootScope.position,
						$rootScope.destination
					).then(function(directions) {
						$rootScope.loading.direction = false;
						// Initialisation de l'itinéraire
						$scope.clearSteps();
						$scope._directions = directions;
						// Affichage
						directionsDisplay.setMap($rootScope.map);
						directionsDisplay.setDirections(directions);
						// DirectionsRenderer Panel
						//directionsDisplay.setPanel(document.getElementById('directions-steps')); // || null
						//$rootScope.message = $filter('capitalize')(destination);
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

		// Efface l'itinéraire
		$scope.clearDirections = function() {
			if ($direction !== undefined && $rootScope.position !== undefined) {
				$direction.initMap($rootScope.position);
			}
			$timeout(function() {
			    $scope.$apply(function () {
					$rootScope.message = '';
					$rootScope.positionMarker = undefined;
					$scope._directions = undefined;
					$scope.destination = '';
					$scope.clearSteps();
				});
			});
			$scope.stopWatch();
		};

		$scope.$on('$destroy', function () {
			$scope.clearDirections();
		});

		// Affiche une étape de l'itinéraire
		$scope.getStep = function(key) {
			if ($scope._directions !== undefined) {
				$scope._steps = $scope._directions.routes[0].legs[0].steps;
				if (key >= 0 && key <= $scope._steps.length) {
					$scope.step = {};
					$scope.step.current = $scope._steps[ key ];
					$scope.step.count = key;
					$direction.fitStep($scope.step.current);
					// Synthès vocale
					var instruction = $direction.getInstruction($scope.step);
					TextToSpeech.say(instruction).then(function(end) {
						console.log(end);
					});
				}
				if (key+1 == $scope._steps.length) {
					TextToSpeech.say('Bien joué !');
				}
			}
		};

		// Réinitialise les étapes
		$scope.clearSteps = function() {
			$scope._steps = undefined;
			if ($scope.step === undefined)
				$scope.step = {};
			$scope.step.current = undefined;
			$scope.step.count = 0;
		};

	}
]);