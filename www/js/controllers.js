'use strict';

angular.module('helmetApp.controllers', [
	'helmetApp.services'
])

.controller('AppController', [
	'$rootScope',
	'$scope',
	function($rootScope, $scope) {

		$rootScope.loading = {
			/*route: true,
			position: true,
			weather: true,
			direction: true*/
		};

		$rootScope.$on("$routeChangeStart", function(){
			$rootScope.loading.route = true;
			$rootScope.message = '';
		});

		$rootScope.$on("$routeChangeSuccess", function(){
			$rootScope.loading.route = false;
		});

	}
])

.controller('WeatherController', [
	'$rootScope',
	'geolocationService',
	'openWeatherApi',
	function($rootScope, geolocationService, openWeatherApi) {
		// Recherche de la position
		$rootScope.loading.position = true;
		geolocationService.getCurrentPosition().then(function(position) {
			$rootScope.loading.position = false;
			// Récupération de la météo
			$rootScope.loading.weather = true;
			openWeatherApi.getCurrentWeather(position).then(function(data) {
				$rootScope.loading.weather = false;
				$rootScope.currentWeather = {
					city: data.name,
					main: data.main,
					data: data.weather
				};
			});
		});
	}
])

.controller('DirectionController', [
	'$rootScope',
	'$scope',
	'$location',
	'$routeParams',
	'$timeout',
	'$filter',
	'geolocationService',
	'DirectionFactory',
	function($rootScope, $scope, $location, $routeParams, $timeout, $filter, geolocationService, DirectionFactory) {
		$rootScope.loading.position = true;
		$scope.step = {
			all: undefined,
			current: undefined,
			count: 0
		};
		//$scope.location = $location;
    	//$scope.routeParams = $routeParams;
		$rootScope.watchId = geolocationService.watchPosition().then(function(position) {
			$rootScope.position = position;
			$rootScope.loading.position = false;
			$scope.findMe = function() {
				var origin = new google.maps.LatLng(
					$rootScope.position.coords.latitude,
					$rootScope.position.coords.longitude
				);
				$rootScope.map.setCenter(origin);
				DirectionFactory.addMarker(origin);
			};
			$scope.getDirection = function(destination) {
				$rootScope.loading.direction = true;
				DirectionFactory.initMap();
				if (destination !== undefined) {
					$rootScope.destination = destination;
					DirectionFactory.getDirections().then(function(directions) {
						$rootScope.loading.direction = false;
						$scope._directions = directions;
						$scope.step.all = $scope._directions.routes[0].legs[0].steps;
						$scope.step.count = 0;
						$scope.step.current = $scope._directions.routes[0].legs[0].steps[0];
						DirectionFactory.fitStep($scope.step.current);
						//$routeParams.direction = $filter('lowercase')(destination);
						$rootScope.message = $filter('capitalize')(destination);
					}, function(error) {
						$rootScope.loading.direction = false;
						$rootScope.message = error === 'ZERO_RESULTS' ? 'Destination introuvable' : error;
					});
				} else {
					$rootScope.message = 'Renseignez une destination';
				}
			};
			$scope.clearDirections = function() {
				DirectionFactory.clearDirections();
				$timeout(function() {
				    $scope.$apply(function () {
						$scope.destination = '';
						$scope._directions = undefined;
						$scope.step = {
							all: undefined,
							current: undefined,
							count: 0
						};
					});
				});
			};
			$scope.$on('$destroy', function () {
				$scope.clearDirections();
			});
			$scope.getStep = function(key) {
				if ($scope._directions !== undefined) {
					var steps = $scope._directions.routes[0].legs[0].steps;
					if (key >= 0 && key <= steps.length) {
						$scope.step.current = steps[ key ];
						$scope.step.count = key;
						DirectionFactory.fitStep($scope.step.current);
					}
					if (key+1 == steps.length) {
						console.log('Well played');
					}
				}
			};
			DirectionFactory.initMap();
			/*$scope.getDirection($scope.destination || $scope.routeParams.dest);
			if ($scope.routeParams.dest !== undefined && $scope.routeParams.dest !== $scope.destination) {
				console.log($routeParams.dest);
			}*/
		}, function(e) {
			$rootScope.message = e;
		});
		$scope.stopWatch = function() {
			navigator.geolocation.clearWatch($rootScope.watchId);
		};

		//1. This needs to be enabled for each controller that needs to watch routeParams
		//2. I believe some encapsulation and reuse through a service might be a better way
		//3. The reference to routeParams will not change so we need to enable deep dirty checking, hence the third parameter
		/*$scope.$watch('routeParams', function(newVal, oldVal) {
		  angular.forEach(newVal, function(v, k) {
		    location.search(k, v);
		  });
		}, true);*/
	}
])

.controller('RouteController', [
	'$rootScope',
	'$scope',
	'geolocationService',
	function($rootScope, $scope, geolocationService) {

		if (navigator.geolocation) {

			$scope.test = {
				watchPosition: ''
			};

			/*var posMarker, latLng, watchId = geolocationService.watchPosition().then(function(position) {
			$scope.test.watchPosition += '<strong>watchPosition</strong><br>' +
				'Latitude: ' + position.coords.latitude + '<br>' +
				'Longitude: ' + position.coords.longitude + '<br>';
				// Mise à jour de la position
				$rootScope.position = position;
				latLng = new google.maps.LatLng(
					position.coords.latitude,
					position.coords.longitude
				);
				if (posMarker) {
					posMarker.setPosition(latLng);
				} else {
					posMarker = new google.maps.Marker({
						position: latLng,
						map: $rootScope.map
					});
				}
				if ($rootScope.map) {
					//$rootScope.map.setCenter(latLng);
				}

				$scope.test.watchPosition += '<strong>watchPosition</strong><br>' +
					'Latitude: ' + position.coords.latitude + '<br>' +
					'Longitude: ' + position.coords.longitude + '<br>';

			});

			$scope.stop = function() {
				navigator.geolocation.clearWatch(watchId);
			};*/


			/*
			geolocationService.getCurrentPosition().then(function(position) {
				$rootScope.position = position;
			});

			$scope.onTick = function() {
				// Get current position
				geolocation.getCurrentPosition().then(function(position) {
					$scope.test.count++;
					$rootScope.position = position;
					console.log(position);
				});
			};

			var tick = $interval($scope.onTick, 5000);

			$scope.$on('$destroy', function () {
				$interval.cancel(tick);
			});

			$scope.destroyInterval = function () {
				$interval.cancel(tick);
			};

			(function tick() {
				geolocationService.getCurrentPosition().then(function(position) {
					$scope.test.count++;
					$rootScope.position = position;
					console.log(position);
					$timeout(tick, 1000);
				});
			})();*/

		} else {
			alert('FU');
		}

	}
]);