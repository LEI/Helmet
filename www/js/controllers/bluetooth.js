'use strict';

angular.module('helmetApp')

.controller('BluetoothController', [
	'$scope',
	'$rootScope',
	'$bluetooth',
	'$timeout',
function($scope, $rootScope, $bluetooth, $timeout) {

		$scope.bluetooth = {
			deviceList: []
		};

		$scope.searchDevice = function() {
			$bluetooth.isEnabled().then( function(response) {
				$scope.bluetooth.loading = true;
				// Découverte des périphériques
				$bluetooth.list().then( function(res) {
					$scope.bluetooth.loading = false;
					$scope.bluetooth.errorMessage = res.length + ' appareil(s) connecté(s)';
					if (res.length > 0) {
						angular.forEach(res, function(device, key) {
							this.push(device);
						}, $scope.bluetooth.deviceList);
						//$scope.connect(res[0].id);
						$timeout(function(){
							scope.$apply();
						});
						console.log(JSON.stringify(res, null, 4));
					} else {
						$scope.bluetoothError = 'Aucun périphérique bluetooth';
					}
				}, function(error) {
					$scope.bluetooth.loading = false;
					console.log(error);
					$scope.bluetooth.errorMessage = error;
				});
			}, function(error) {
				$scope.bluetooth.errorMessage = error;
			});
		}

		$scope.connect = function(id) {
			console.log('Tentative de connexion ' + id + '...');
			$bluetooth.connect(id).then( function(response) {
				console.log(response);
				$scope.check();
			}, function(error) {
				console.log(error);
				$scope.bluetooth.errorMessage = error;
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
