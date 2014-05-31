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
	'$sce',
	'$geolocation',
	'$direction',
	'TextToSpeech',
	'SpeechRecognition',
	function($rootScope, $scope, $timeout, $filter, $sce, $geolocation, $direction, TextToSpeech, SpeechRecognition) {

		var distance, startPos;
		if ('google' in window) {
			var directionsDisplay = new google.maps.DirectionsRenderer();
		}

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
			$direction.initMap(position); // $direction undefined ?
			if (position.coords.speed) {
				$rootScope.speed = position.coords.speed;
			}
		}, function(error) {
			console.log(error);
			$rootScope.message = 'Position inconnue';
		});

		// watchPosition
		$rootScope.watchId = $geolocation.watchPosition({
			frequency: 3000
		}).then(function(position) {
			$rootScope.loading.position = false;
			$rootScope.position = position;
			distance = $geolocation.calculateDistance(
				startPos.coords.latitude, startPos.coords.longitude,
				position.coords.latitude, position.coords.longitude);
			console.log(position);
			if (position.coords.speed) {
				$rootScope.speed = position.coords.speed;
			}
			$rootScope.distance = '(' + (distance * 1000).toFixed(2) + ' m)';
			//$direction.locateMe(position);
		}, function(error) {
			alert(error);
			$rootScope.message = 'Position inconnue...';
		});

		$scope.stopWatch = function() {
			navigator.geolocation.clearWatch($rootScope.waitPosition);
		};

		$scope.findMe = function() {
			$direction.locateMe($rootScope.position);
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