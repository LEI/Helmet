'use strict';

angular.module('helmetApp.arduino', [])

.controller('BluetoothController', [
	'$rootScope',
	'$scope',
function($rootScope, $scope) {

	$scope.testBt = function() {
		console.log('lol');
	};

}]);