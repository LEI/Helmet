'use strict';

angular.module('bluetooth', [])

.factory('bluetooth', [function() {
	if (typeof cordova !== 'undefined') {

	    console.log(bluetoothSerial);

	    return {
	        sendMessage: function(message) {
	            // interact with bluetoothSerial
	            alert("coucou");
	        }
	    };
	}
}])

.controller('BluetoothController', [
	'$rootScope',
	'$scope',
	'bluetooth',
function($rootScope, $scope, bluetooth) {

	$scope.connectToDevice = function() {
		alert('lol');
	};

}]);