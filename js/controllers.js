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

.controller('RouteController', ['$scope', 'geolocation', function($scope, geolocation) {

	$scope.test = 'Recherche en cours...<br>';

	if (navigator.geolocation) {

		// Watch position
		geolocation.watchPosition(
			// Success
			function(position) {
				$scope.position = position;
				console.log(position);
				$scope.test += '<strong>Position changed</strong> (watchPosition)<br>' +
					'Latitude: ' + position.coords.latitude + '<br>' +
					'Longitude: ' + position.coords.longitude + '<br>';
			},
			// Fail
			function(error) {
				console.log(error);
				$scope.test += '<strong>Error code ' + error.code + '</strong> (watchPosition)<br>' + error.message + '<br>';
			},
			{
				timeout: 1000,
				enableHighAccuracy: true,
				maximumAge: 0
			}
		);

		var intervalId = setInterval(function () {
			// Get current position
			geolocation.getCurrentPosition(
				// Success
				function(position) {
					$scope.position = position;
					console.log(position);
					$scope.test += '<strong>Current position</strong> (getCurrentPosition)<br>' +
						'Latitude: ' + position.coords.latitude + '<br>' +
						'Longitude: ' + position.coords.longitude + '<br>';
				},
				// Fail
				function(error) {
					console.log(error);
					$scope.test += '<strong>Error code ' + error.code + '</strong> (getCurrentPosition)<br>' + error.message + '<br>';
				},
				{
					timeout: 1000,
					enableHighAccuracy: true,
					maximumAge: 0
				}
			);
		}, 1000);

		$scope.$on('$destroy', function () {
			clearInterval(intervalId);
		});

	} else {
		alert('FU');
	}

}]);