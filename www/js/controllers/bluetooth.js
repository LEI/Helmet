'use strict';

angular.module('helmetApp')

.controller('BluetoothController', [
	'$rootScope',
	'$scope',
	'$bluetooth',
	function($rootScope, $scope, $bluetooth) {

		//$scope.listDevices = bluetooth.list();

		$scope.connectToDevice = function(device) {
			//bluetooth.connect(device);
		};
		$scope.disconnect = function() {
			//bluetooth.disconnect();
		};


	}
]);
