'use strict';

angular.module('helmetApp')

.controller('BluetoothController', [
	'$scope',
	'$rootScope',
	'$bluetooth',
function($scope, $rootScope, $bluetooth) {

		$scope.deviceList = {};

		$scope.searchDevice = function() {
			$rootScope.loading.bluetooth = true;
			$bluetooth.isEnabled().then( function(response) {
				$bluetooth.list().then( function(res) {
					$scope.bluetoothError = res.length + ' appareil(s) connecté(s)';
					if (res.length > 0) {
						$rootScope.loading.bluetooth = false;
						for (var i = res.length - 1; i >= 0; i--) {
							$scope.deviceList[res[i].id] = res[i];
						};

						console.log(JSON.stringify(res, null, 4));

						$scope.connect(res[0].id);

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
			$bluetooth.connect(id).then( function(response) {
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
