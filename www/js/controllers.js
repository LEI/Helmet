'use strict';

angular.module('helmetApp.controllers', [
	'helmetApp.services'
])

.controller('AppController', [
	'$rootScope',
	'$scope',
function($rootScope, $scope) {

	$scope.test = 'Hello World';
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
	'$rootScope',
	'geolocation',
	'openWeatherApi',
	'$timeout',
function($rootScope, geolocation, openWeatherApi, $timeout) {
	// Recherche de la position
	geolocation.getCurrentPosition().then(function(position) {
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
}])

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
		$scope.getDirections = function(destination) {
			$rootScope.loading.direction = true;
			googleApi.initMap();
			$rootScope.destination = destination !== undefined ? destination : 'Paris';
			googleApi.getDirections().then(function(direction) {
				$rootScope.loading.direction = false;
				$rootScope.destinationTitle = $rootScope.destination + ' '
					+ direction.routes[0].legs[0].distance.text + ' '
					+ direction.routes[0].legs[0].duration.text;
				$rootScope.message = '';
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
	}, function(e) {
		console.log(e);
		$rootScope.destinationTitle = false;
		$rootScope.message = e;
	});
	$scope.stopWatch = function() {
		navigator.geolocation.clearWatch($rootScope.watchId);
	};
}])

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
			// if (posMarker) {
			// 	posMarker.setPosition(latLng);
			// } else {
			// 	posMarker = new google.maps.Marker({
			// 		position: latLng,
			// 		map: $rootScope.map
			// 	});
			// }
			if ($rootScope.map) {
				$rootScope.map.setCenter(latLng);
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

}]);