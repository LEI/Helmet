'use strict';

angular.module('helmetApp')

.controller('BluetoothController', [
	'$scope',
	'$rootScope',
	'$bluetooth',
	'$timeout',
function($scope, $rootScope, $bluetooth, $timeout) {

		$rootScope.devices = {};

		$scope.searchDevice = function() {
			$rootScope.loading.bluetooth = true;
			$bluetooth.isEnabled().then( function(response) {
				$bluetooth.list().then( function(res) {
					$scope.bluetoothError = res.length + ' appareil(s) connecté(s)';
					if (res.length > 0) {

						$rootScope.loading.bluetooth = false;

						$timeout(function() {
							$scope.$apply(function() {
								$rootScope.devices.list = res;
							});
						});

						//$scope.connect(res[0].id);

						console.log(JSON.stringify(res, null, 4));

					} else {
						$scope.bluetoothError = 'Aucun périphérique bluetooth';
					}
				}, function(error) {
					console.log(error);
					$scope.bluetoothError = error;
				});
			}, function(error) {
				console.log(error);
				$scope.bluetoothError = 'Bluetooth indisponible ' + error;
			});
		}

		$scope.connect = function(id) {
			console.log('Tentative de connexion ' + id + '...');
			$bluetooth.connectInsecure(id).then( function(response) {
				console.log(response);
				$scope.check();
			}, function(error) {
				console.log(error);
				$scope.bluetoothError = error;
			});
		}

		$scope.check = function() {
			$bluetooth.isConnected().then( function(response) {
				console.log(response);
			}, function(error) {
				console.log(error);
			});
		}

	}
]);
