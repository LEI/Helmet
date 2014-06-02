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
		var distance, startPos;
		$rootScope.loading.position = true;
		$rootScope.audio = {
			textToSpeech: false
		};
		$rootScope.message = 'Géolocalisation...';
		// Initialisation de la position
		$rootScope.waitPosition = $geolocation.getCurrentPosition({
			timeout: 30000,
			enableHighAccuracy: true,
			maximumAge: 30000
		}).then(function(position) {
			startPos = position;
			$rootScope.position = position;
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
			$rootScope.loading.position = true;
			$geolocation.watchPosition({
				timeout: 30000,
				enableHighAccuracy: false,
				maximumAge: 30000
			}).then(function(position) {
				// resolve
			}, function(error) {
				// reject
				alert(error);
				$rootScope.message = 'Position inconnue...';
			}, function(newPos) {
				// notify
				$rootScope.loading.position = false;
				$rootScope.position = newPos;
				if (newPos.coords.speed !== null) {
					$rootScope.speed = newPos.coords.speed;
				}
				// Calcul de la distance depuis le point de départ
				distance = $geolocation.calculateDistance(
					startPos.coords.latitude, startPos.coords.longitude,
					newPos.coords.latitude, newPos.coords.longitude);
				// Conversion en mètres
				$rootScope.distance = distance * 1000;
				// Affichage du point sur la carte
				$direction.updatePositionMarker(newPos);
				//console.log(JSON.stringify(newPos,null,4));
			});
		};

		$scope.stopWatch = function() {
			$geolocation.clearWatch();
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
						// Affichage carte
						$direction.displayDirection(direction);
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

		// Affiche une étape de l'itinéraire
		$scope.getStep = function(key) {
			if ($scope._directions !== undefined) {
				$scope._steps = $scope._directions.routes[0].legs[0].steps;
				if (key >= 0 && key <= $scope._steps.length) {
					$scope.step = {};
					$scope.step.current = $scope._steps[ key ];
					$scope.step.count = key;
					$direction.fitStep($scope.step.current);

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
			$scope.clearDirection();
			$timeout(function() {
			    $scope.$apply(function () {
					$rootScope.accuracy = undefined;
					$rootScope.distance = undefined;
					$rootScope.positionMarker = undefined;
				});
			});
			//directionsDisplay.setMap(null);
			//if ($direction !== undefined && $rootScope.position !== undefined)
			$direction.initMap($rootScope.position);
		};

		$scope.clearDirection = function() {
			$geolocation.clearWatch();
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
			$scope.step.count = 0;
		};

		$scope.toggleVoice = function() {
			TextToSpeech.active = !TextToSpeech.active;
			$rootScope.audio.textToSpeech = TextToSpeech.active;
		};

	}
]);