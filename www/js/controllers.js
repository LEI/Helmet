'use strict';

angular.module('helmetApp.controllers', [
	'helmetApp.services'
])

.controller('AppController', [
	'$rootScope',
	'$scope',
	function($rootScope, $scope) {
		// Chargement : route, position, weather, direction
		$rootScope.loading = {};

		$rootScope.$on("$routeChangeStart", function(){
			$rootScope.loading.route = true;
			$rootScope.message = '';
		});

		$rootScope.$on("$routeChangeSuccess", function(){
			$rootScope.loading.route = false;
		});
	}
])

// Météo
.controller('WeatherController', [
	'$rootScope',
	'geolocationService',
	'openWeatherApi',
	function($rootScope, geolocationService, openWeatherApi) {
		$rootScope.currentWeather = {};
		// Recherche de la position ( $rootScope.watchId.then() ? )
		geolocationService.getCurrentPosition().then(function(position) {
			// Recherche de la météo
			$rootScope.loading.weather = true;
			openWeatherApi.getCurrentWeather($rootScope.position).then(function(data) {
				$rootScope.loading.weather = false;
				$rootScope.currentWeather = {
					city: data.name,
					main: data.main,
					data: data.weather
				};
			},
			function(error) {
				$rootScope.loading.weather = false;
				$rootScope.currentWeather.errorMessage = error;
			});
		});
	}
])

// Itinéraire
.controller('DirectionController', [
	'$rootScope',
	'$scope',
	'$timeout',
	'$filter',
	'geolocationService',
	'DirectionFactory',
	function($rootScope, $scope, $timeout, $filter, geolocationService, DirectionFactory) {
		$rootScope.loading.position = true;
		// watchPosition
		$rootScope.watchId = geolocationService.watchPosition().then(function(position) {
			$rootScope.position = position;
			$rootScope.loading.position = false;
			DirectionFactory.initMap(position);
		}, function(error) {
			console.log(error);
			$rootScope.message = 'API Google inaccessible';
		});
		$scope.stopWatch = function() {
			navigator.geolocation.clearWatch($rootScope.watchId);
		};
		// Marqueur position
		$scope.findMe = function() {
			$rootScope.watchId.then(function() {
				var origin = new google.maps.LatLng(
					$rootScope.position.coords.latitude,
					$rootScope.position.coords.longitude
				);
				$rootScope.map.setCenter(origin);
				DirectionFactory.addMarker(origin);
			});
		};
		// Affiche un itinéraire
		$scope.getDirection = function(destination) {
			$rootScope.loading.direction = true;
			// Attente de la position
			$rootScope.watchId.then(function() {
				if (destination !== undefined) {
					$rootScope.destination = destination;
					// Recherche de l'itinéraire
					DirectionFactory.getDirections(
						$rootScope.position,
						$rootScope.destination
					).then(function(directions) {
						$rootScope.loading.direction = false;
						// Initialisation de l'itinéraire
						$scope.clearSteps();
						$scope._directions = directions;
						$rootScope.message = $filter('capitalize')(destination);
					}, function(error) {
						$rootScope.loading.direction = false;
						$rootScope.message = error === 'ZERO_RESULTS' ? 'Destination introuvable' : error;
					});
				} else {
					$rootScope.loading.direction = false;
					$rootScope.message = 'Renseignez une destination';
				}
			});
		};
		// Efface l'itinéraire
		$scope.clearDirections = function() {
			DirectionFactory.initMap($rootScope.position);
			$timeout(function() {
			    $scope.$apply(function () {
					$rootScope.message = '';
					//$scope.destination = '';
					$scope._directions = undefined;
					$scope.clearSteps();
				});
			});
		};
		$rootScope.$on('$destroy', function () {
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
					DirectionFactory.fitStep($scope.step.current);
				}
				if (key+1 == $scope._steps.length) {
					console.log('Well played');
				}
			}
		};
		// Réinitialise les étapes
		$scope.clearSteps = function() {
			$scope._steps = undefined;
			if ($scope.step === undefined)
				$scope.step = {};
			$scope.step.count = undefined;
			$scope.step.current = undefined;
		};
	}
]);





/* Tests
.controller('RouteController', [
	'$rootScope',
	'$scope',
	'geolocationService',
	function($rootScope, $scope, geolocationService) {

		if (navigator.geolocation) {

			$scope.test = {
				watchPosition: ''
			};
			//1. This needs to be enabled for each controller that needs to watch routeParams
			//2. I believe some encapsulation and reuse through a service might be a better way
			//3. The reference to routeParams will not change so we need to enable deep dirty checking, hence the third parameter
			// $scope.$watch('routeParams', function(newVal, oldVal) {
			//   angular.forEach(newVal, function(v, k) {
			//     location.search(k, v);
			//   });
			// }, true);

			// var posMarker, latLng, watchId = geolocationService.watchPosition().then(function(position) {
			// $scope.test.watchPosition += '<strong>watchPosition</strong><br>' +
			// 	'Latitude: ' + position.coords.latitude + '<br>' +
			// 	'Longitude: ' + position.coords.longitude + '<br>';
			// 	// Mise à jour de la position
			// 	$rootScope.position = position;
			// 	latLng = new google.maps.LatLng(
			// 		position.coords.latitude,
			// 		position.coords.longitude
			// 	);
			// 	if (posMarker) {
			// 		posMarker.setPosition(latLng);
			// 	} else {
			// 		posMarker = new google.maps.Marker({
			// 			position: latLng,
			// 			map: $rootScope.map
			// 		});
			// 	}
			// 	if ($rootScope.map) {
			// 		//$rootScope.map.setCenter(latLng);
			// 	}

			// 	$scope.test.watchPosition += '<strong>watchPosition</strong><br>' +
			// 		'Latitude: ' + position.coords.latitude + '<br>' +
			// 		'Longitude: ' + position.coords.longitude + '<br>';

			// });

			// $scope.stop = function() {
			// 	navigator.geolocation.clearWatch(watchId);
			// };




			// geolocationService.getCurrentPosition().then(function(position) {
			// 	$rootScope.position = position;
			// });

			// $scope.onTick = function() {
			// 	// Get current position
			// 	geolocation.getCurrentPosition().then(function(position) {
			// 		$scope.test.count++;
			// 		$rootScope.position = position;
			// 		console.log(position);
			// 	});
			// };

			// var tick = $interval($scope.onTick, 5000);

			// $scope.$on('$destroy', function () {
			// 	$interval.cancel(tick);
			// });

			// $scope.destroyInterval = function () {
			// 	$interval.cancel(tick);
			// };

			// (function tick() {
			// 	geolocationService.getCurrentPosition().then(function(position) {
			// 		$scope.test.count++;
			// 		$rootScope.position = position;
			// 		console.log(position);
			// 		$timeout(tick, 1000);
			// 	});
			// })();

		} else {
			alert('FU');
		}

	}
])*/