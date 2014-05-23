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
	'geolocation',
	'openWeatherApi',
	'$timeout',
	function($rootScope, geolocation, openWeatherApi, $timeout) {
		// Recherche de la position
		$rootScope.loading.position = true;
		geolocation.getCurrentPosition().then(function(position) {
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
	'geolocation',
	'googleApi',
	function($rootScope, $scope, geolocation, googleApi) {
		$rootScope.loading.position = true;
		$rootScope.watchId = geolocation.watchPosition().then(function(position) {
			$rootScope.position = position;
			$rootScope.loading.position = false;
			//debug
			$scope.test.watchPosition += '<strong>watchPosition</strong><br>' +
				'Latitude: ' + position.coords.latitude + '<br>' +
				'Longitude: ' + position.coords.longitude + '<br>';

			$scope.findMe = function() {
				var origin = new google.maps.LatLng(
					$rootScope.position.coords.latitude,
					$rootScope.position.coords.longitude
				);
				$rootScope.map.setCenter(origin);
				googleApi.addMarker(origin);
			}
			$scope.getDirections = function(destination) {
				$rootScope.loading.direction = true;
				googleApi.initMap();
				$rootScope.destination = destination !== undefined ? destination : 'Paris';
				googleApi.getDirections().then(function(directions) {
					$rootScope.loading.direction = false;
					$scope.directions = directions;
					console.log(directions);
					$rootScope.message = '';
					$rootScope.destinationTitle = $rootScope.destination + ' '
						+ directions.routes[0].legs[0].distance.text + ' '
						+ directions.routes[0].legs[0].duration.text;
				}, function(error) {
					$rootScope.loading.direction = false;
					$rootScope.destinationTitle = '';
					$rootScope.message = error === 'ZERO_RESULTS' ? 'Destination introuvable' : error;
				});
			}
			$scope.clearDirections = function() {
				googleApi.clearDirections();
				$scope.destination = '';
			}
			$scope.$on('$destroy', function () {
				$scope.clearDirections();
			});

			$scope.getDirections('Paris');

		}, function(e) {
			console.log(e);
			$rootScope.destinationTitle = false;
			$rootScope.message = e;
		});
		$scope.stopWatch = function() {
			navigator.geolocation.clearWatch($rootScope.watchId);
		};
	}
])

.controller('RouteController', [
	'$rootScope',
	'$scope',
	'geolocation',
	function($rootScope, $scope, geolocation) {

		if (navigator.geolocation) {

			$scope.test = {
				watchPosition: ''
			};

			/*var posMarker, latLng, watchId = geolocation.watchPosition().then(function(position) {
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
			geolocation.getCurrentPosition().then(function(position) {
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
				geolocation.getCurrentPosition().then(function(position) {
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