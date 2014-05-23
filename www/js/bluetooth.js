'use strict';

angular.module('helmetApp.bluetooth', [])

.factory('bluetooth', [function() {
	if (typeof cordova !== 'undefined') {

		console.log(bluetoothSerial);

		return {
			connect: function() {
				// connect salope
			},
		};
	}
}])

.controller('BluetoothController', [
	'$rootScope',
	'$scope',
	'bluetooth',
function($rootScope, $scope, bluetooth) {

	$scope.listDevices = [];

	$scope.connectToDevice = function() {
		alert('lol');
	};

}]);