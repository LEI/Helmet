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

.controller('RouteController', [
	'$rootScope',
	'$scope',
	'$interval',
	'geolocation',
	'directionsApi',
function($rootScope, $scope, $interval, geolocation, directionsApi) {

	$scope.test = {
		title: 'Recherche en cours...',
		getCurrentPosition: 0,
		watchPosition: ''
	};

	$scope.getDirection = function(destination) {
		directionsApi.getDirection($rootScope.position, destination).then(function(direction) {
			if (direction != false) {
				$scope.destination += ' ' + direction.routes[0].legs[0].distance.text
									+ ' ' + direction.routes[0].legs[0].duration.text;
			} else {
				$scope.destination += 'falsh';
			}
		});
	};

	if (navigator.geolocation) {

		geolocation.watchPosition().then(function(position) {
			//$rootScope.position = position;
			$scope.test.watchPosition += '<strong>watchPosition</strong><br>' +
				'Latitude: ' + position.coords.latitude + '<br>' +
				'Longitude: ' + position.coords.longitude + '<br>';
		});

		geolocation.getCurrentPosition().then(function(position) {

			$scope.destination = 'Paris';
			$rootScope.position = position;

			$scope.getDirection($scope.destination);

		});

		$scope.onTick = function() {
			// Get current position
			geolocation.getCurrentPosition().then(function(position) {
				$scope.test.getCurrentPosition++;
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

		/*(function tick() {
			geolocation.getCurrentPosition().then(function(position) {
				$scope.test.getCurrentPosition++;
				$rootScope.position = position;
				console.log(position);
				$timeout(tick, 1000);
			});
		})();*/

	} else {
		alert('FU');
	}

}]);