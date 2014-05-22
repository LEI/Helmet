'use strict';

angular.module('helmetApp.controllers', [
	'helmetApp.services'
])

.controller('AppController', [
	'$rootScope',
	'$scope',
function($rootScope, $scope) {

	$scope.test = 'Hello World';

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});
	$rootScope.$on("$routeChangeSuccess", function(){
		$rootScope.loading = false;
	});

}])

.controller('WeatherController', [
	'$scope',
	'geolocation',
	'openWeatherApi',
function($scope, geolocation, openWeatherApi) {
	// Recherche de la position
	geolocation.getCurrentPosition().then(function(position) {
		// Récupération de la météo
		openWeatherApi.getCurrentWeather(position).then(function(data) {
			$scope.currentWeather = {
				city: data.name,
				main: data.main,
				data: data.weather
			};
		});
	});
}])

.controller('DirectionController', [
	'$rootScope',
	'$scope',
	'geolocation',
	'googleApi',
function($rootScope, $scope, geolocation, googleApi) {
	geolocation.getCurrentPosition().then(function(position) {
		$rootScope.position = position;
		googleApi.initMap();

		$scope.getDirections = function(destination) {
			$rootScope.destination = destination !== undefined ? destination : 'Paris';
			googleApi.getDirections().then(function(direction) {
				$rootScope.destinationDistance = $rootScope.destination;
				$rootScope.destinationDistance += ' ' + direction.routes[0].legs[0].distance.text
				+ ' ' + direction.routes[0].legs[0].duration.text;
			}, function(error) {
				console.log(error);
			});
		}
		$scope.clearDirections = function() {
			googleApi.clearDirections();
		}
	});

}])

.controller('RouteController', [
	'$rootScope',
	'$scope',
	'geolocation',
function($rootScope, $scope, geolocation) {

	if (navigator.geolocation) {

		$scope.test = {
			title: 'Recherche en cours...',
			count: 0,
			watchPosition: 'Position'
		};

		var m, newPoint, watchId = geolocation.watchPosition().then(function(position) {
			$rootScope.position = position;
			$scope.test.watchPosition += '<strong>watchPosition</strong><br>' +
				'Latitude: ' + position.coords.latitude + '<br>' +
				'Longitude: ' + position.coords.longitude + '<br>';

			newPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			if (m) {
				m.setPosition(newPoint);
			} else {
				m = new google.maps.Marker({
					position: newPoint,
					map: $rootScope.map
				});
			}
			$rootScope.map.setCenter(newPoint);
		});

		$scope.stop = function() {
			navigator.geolocation.clearWatch(watchId);
		};

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

}]);