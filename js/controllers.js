'use strict';

angular.module('appHelmet.controllers', [
	'appHelmet.services'
])

.controller('AppController', ['$scope', function($scope) {

	$scope.test = 'Hello World';

}])

.controller('RouteController', ['$scope', 'geolocation', function($scope, geolocation) {

	$scope.test = 'Recherche en cours...<br>';

	if (navigator.geolocation) {

		geolocation.getCurrentPosition(
			// Success
			function(position) {
				console.log(position);
				$scope.test += '<strong>getCurrentPosition</strong><br>' +
					'Latitude: ' + position.coords.latitude + '<br>' +
					'Longitude: ' + position.coords.longitude + '<br>';
			},
			// Fail
			function(error) {
				console.log(error);
				$scope.test += '<strong>getCurrentPosition</strong><br>' +
				'Error code ' + error.code + ' - ' + error.message + '<br>';
			},
			{ timeout: 3000, enableHighAccuracy: true, maximumAge: 0 }
		);

		geolocation.watchPosition(
			// Success
			function(position) {
				console.log(position);
				$scope.test += '<strong>watchPosition</strong><br>' +
					'Latitude: ' + position.coords.latitude + '<br>' +
					'Longitude: ' + position.coords.longitude + '<br>';
			},
			// Fail
			function(error) {
				console.log(error);
				$scope.test += '<strong>watchPosition</strong><br>' +
				'Error code ' + error.code + ' - ' + error.message + '<br>';
			},
			{ timeout: 5000, enableHighAccuracy: true, maximumAge: 0 }
		);
	} else {
		alert('FU');
	}

}]);