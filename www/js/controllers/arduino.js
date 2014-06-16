'use strict';

angular.module('helmetApp')

.controller('ArduinoController', [
	'$scope',
	'$rootScope',
	'$bluetooth',
function($scope, $rootScope, $bluetooth) {

	$scope.show = function() {
		console.log($bluetooth.deviceList);
		alert($bluetooth.deviceList);
	};

}]);
