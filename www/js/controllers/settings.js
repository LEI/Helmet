'use strict';

angular.module('helmetApp')

.controller('SettingsController', [
	'$scope',
	'$rootScope',
	'$interval',
	'$localStorage',
	'$notification',
	'$bluetooth',
function($scope, $rootScope, $interval, $localStorage, $notification, $bluetooth) {

	/*
	 *	Bluetooth
	 */

	$scope.bluetooth = {
		deviceList: {},
		loading: false,
		connected: false,
		errorMessage: ''
	};

	$scope.initBluetooth = function() {
		var resumeState = $scope.$on('resume', $scope.initBluetooth);
		$bluetooth.isEnabled(true).then(function() {
			// Local Storage
			if ($rootScope.$storage.deviceList !== undefined) {
				// Restitution des derniers appareils connectés
				angular.forEach($rootScope.$storage.deviceList,
				function(device, key) {
					device.stored = true;
					$scope.bluetooth.deviceList[device.id] = device;
				});
				//$bluetooth.deviceList = $scope.bluetooth.deviceList;
			}
			$scope.bluetooth.errorMessage = '';
			resumeState();
		}, function(error) {
			$scope.bluetooth.errorMessage = error;
		});
	};

	$scope.discover = function() {
		$bluetooth.isEnabled().then(function(response) {
			$scope.bluetooth.loading = true;
			// Découverte des périphériques
			$bluetooth.list().then(function(response) {
				$scope.bluetooth.loading = false;
				if (response.length > 0) {
					angular.forEach(response, function(device, key) {
						$scope.bluetooth.deviceList[device.id] = device;
					});
					//console.log(JSON.stringify(response, null, 4));
					$scope.bluetooth.errorMessage = '';
				} else {
					$scope.bluetooth.errorMessage = 'Aucun périphérique associé';
				}
			}, function(error) {
				$scope.bluetooth.loading = false;
				$scope.bluetooth.errorMessage = error;
			});
		}, function(error) {
			$scope.bluetooth.errorMessage = error;
		});
	};

	var tick;
	$scope.connect = function(id) {
		$bluetooth.isEnabled().then(function(response) {
			// Tentative de connexion
			$scope.bluetooth.loading = true;
			$bluetooth.connect(id).then(function(response) {
				$scope.bluetooth.loading = false;
				$scope.bluetooth.errorMessage = '';
				// Sauvegarde de l'appareil connecté
				//$scope.bluetooth.deviceList[id].connected = true;
				$scope.bluetooth.connected = id;
				/*tick = $interval(function() {
					$bluetooth.read().then(function(response) {
						console.log(response);
					}, function(error) {
						console.log(error);
					});
				}, 1000);*/
				if ($rootScope.$storage.deviceList === undefined) {
					$rootScope.$storage.deviceList = {};
				}
				$rootScope.$storage.deviceList = $scope.bluetooth.deviceList;
			}, function(error) {
				$scope.bluetooth.loading = false;
				// 'Connexion impossible'
				$scope.bluetooth.errorMessage = error;
			});
		}, function(error) {
			$scope.bluetooth.errorMessage = error;
		});
	};

	$scope.disconnect = function(id) {
		//$interval.clear(tick);
		$bluetooth.isConnected().then(function(a) {
			$scope.bluetooth.loading = true;
			$bluetooth.disconnect().then(function(response) {
				$scope.bluetooth.loading = false;
				$scope.bluetooth.errorMessage = '';
				//$scope.bluetooth.deviceList[id].connected = false;
				$scope.bluetooth.connected = false;
			}, function(error) {
				$scope.bluetooth.loading = false;
				$scope.bluetooth.errorMessage = error;
			});
		}, function(error) {
			$scope.bluetooth.errorMessage = error;
		});
	};

	$scope.write = function(data) {
		if (data !== undefined) {
			console.log('Données envoyées: ' + data);
			$scope.bluetooth.loading = true;
			$bluetooth.write(data).then(function(response) {
				$scope.bluetooth.loading = false;
				console.log('Réponse reçue: ' + response);
			}, function(error) {
				$scope.bluetooth.loading = false;
				console.log(error);
				alert(error);
			});
		}
	};

	$scope.available = function() {
		$scope.bluetooth.loading = true;
		$bluetooth.available().then(function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			alert(error);
		});
	};

	$scope.read = function() {
		$scope.bluetooth.loading = true;
		console.log('Read');
		$bluetooth.read().then(function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			//alert(error);
		});
	};


	$scope.readUntil = function(delimiter) {
		$scope.bluetooth.loading = true;
		console.log('ReadUntil');
		$bluetooth.readUntil(delimiter).then(function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			//alert(error);
		});
	};

	$scope.subscribe = function(delimiter) {
		$scope.bluetooth.loading = true;
		console.log('Subscribe');
		$bluetooth.subscribe(delimiter).then(function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			//alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			//alert(error);
		});
	};

	$scope.unsubscribe = function() {
		$scope.bluetooth.loading = true;
		console.log('Unsubscribe');
		$bluetooth.unsubscribe().then(function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			//alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			//alert(error);
		});
	};

	$scope.clear = function() {
		$scope.bluetooth.loading = true;
		console.log('Clear');
		$bluetooth.clear().then(function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			//alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			//alert(error);
		});
	};

	// Initialisation
	$scope.initBluetooth();

}]);
