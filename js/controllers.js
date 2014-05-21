'use strict';

angular.module('appHelmet.controllers', [
	'appHelmet.services'
])

.controller('AppController', ['$rootScope', '$scope', function($rootScope, $scope) {

	$scope.test = 'Hello World';

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});
	$rootScope.$on("$routeChangeSuccess", function(){
		$rootScope.loading = false;
	});

}])

.controller('WeatherController', ['$scope', 'geolocation', 'openWeatherMap', function($scope, geolocation, openWeatherMap) {
	$scope.currentWeather = { city: 'Météo' };
	geolocation.getCurrentPosition().then(function(position) {
		openWeatherMap.getCurrentWeather(position).then(function(data) {
			$scope.currentWeather = {
				city: data.name,
				main: data.main,
				data: data.weather
			};
		});
	});
}])

.controller('RouteController', ['$scope', 'geolocation', 'directionsApi', function($scope, geolocation, directionsApi) {

	$scope.test = '';

	geolocation.getCurrentPosition().then(function(position) {
		var destination = 'Paris';
		directionsApi.getDirection(position, destination).then(function(a, b) {
			console.log(a);
			console.log(b);
			$scope.test = a.routes[0].legs[0].distance.text + ' ' + a.routes[0].legs[0].duration.text;
		});
	});

	if (navigator.geolocation) {

		// Watch position
		/*geolocation.watchPosition(
			// Success
			function(position) {
				$scope.position = position;
				$scope.test += '<strong>Position changed</strong> (watchPosition)<br>' +
					'Latitude: ' + position.coords.latitude + '<br>' +
					'Longitude: ' + position.coords.longitude + '<br>';
			},
			// Fail
			function(error) {
				$scope.test += '<strong>Error code ' + error.code + '</strong> (watchPosition)<br>' + error.message + '<br>';
			},
			{
				timeout: 5000,
				enableHighAccuracy: true,
				maximumAge: 0
			}
		);

		var intervalId = setInterval(function () {
			// Get current position
			geolocation.getCurrentPosition().then(function(position) {

			});

				// Success
				function(position) {
					$scope.position = position;
					$scope.test += '<strong>Current position</strong> (getCurrentPosition)<br>' +
						'Latitude: ' + position.coords.latitude + '<br>' +
						'Longitude: ' + position.coords.longitude + '<br>';
				},
				// Fail
				function(error) {
					$scope.test += '<strong>Error code ' + error.code + '</strong> (getCurrentPosition)<br>' + error.message + '<br>';
				},
				{
					timeout: 5000,
					enableHighAccuracy: true,
					maximumAge: 0
				}
			);
		}, 5000);*/

		var intervalId = setInterval(function () {
			// Get current position
			geolocation.getCurrentPosition().then(function(position) {
				$scope.position = position;
				$scope.test += '<strong>Current position</strong> (getCurrentPosition)<br>' +
					'Latitude: ' + position.coords.latitude + '<br>' +
					'Longitude: ' + position.coords.longitude + '<br>';
			});
		}, 1000);

		$scope.$on('$destroy', function () {
			clearInterval(intervalId);
		});

		$scope.destroyInterval = function () {
			clearInterval(intervalId);
		};

	} else {
		alert('FU');
	}

}]);