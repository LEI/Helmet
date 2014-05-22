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

.controller('BluetoothController', [
	'$rootScope',
	'$scope',
	'bluetooth',
function($rootScope, $scope, bluetooth) {
	echo('a');
	$rootScope.amac = '00X';
	bluetooth.sendMessage();
	$rootScope.amac = '00X';
	$rootScope.sendM = function(mess) {
		alert(mess);
		echo('a');
	};
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
				console.log(direction);
			});
		}
	});

}])

.controller('RouteController', [
	'$rootScope',
	'$scope',
	'geolocation',
	'directionsApi',
function($rootScope, $scope, geolocation, directionsApi) {

	if (navigator.geolocation) {

		/*$scope.test = {
			title: 'Recherche en cours...',
			count: 0,
			watchPosition: 'Position'
		};

		var watchId = geolocation.watchPosition().then(function(position) {
			$rootScope.position = position;
			$scope.test.watchPosition += '<strong>watchPosition</strong><br>' +
				'Latitude: ' + position.coords.latitude + '<br>' +
				'Longitude: ' + position.coords.longitude + '<br>';
		});

		$scope.stop = function() {
			navigator.geolocation.clearWatch(watchId);
		};

		geolocation.getCurrentPosition().then(function(position) {
			$rootScope.position = position;
		});*/

		/*
		$scope.getDirection = function(position, destination) {
			directionsApi.getDirection(position, destination).then(function(direction) {
				if (direction != false) {
					$scope.destination += ' ' + direction.routes[0].legs[0].distance.text
										+ ' ' + direction.routes[0].legs[0].duration.text;
				} else {
					$scope.destination += 'falsh';
				}
			});
		};


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