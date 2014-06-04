'use strict';

angular.module('helmetApp')

.controller('SettingsController', [
	'$q',
	'$scope',
	'$rootScope',
	'$timeout',
	'$localStorage',
	'$bluetooth',
	'$notification',
function($q, $scope, $rootScope, $timeout, $localStorage, $bluetooth, $notification) {

	$rootScope.$storage = $localStorage;

	/*
	 *	Bluetooth
	 */
	$scope.bluetooth = {
		deviceList: {},
		loading: false,
		errorMessage: ''
	};
	//$scope.bluetooth.deviceList['01:23:45:67:89']={id:'01:23:45:67:89',name:'EX_AMPPLE',connected:false,stored:true};
	//$scope.bluetooth.deviceList['98:76:54:32:10']={id:'98:76:54:32:10',name:'JET_TSET',connected:true,stored:false};
	$bluetooth.isEnabled(true).then(function() {}, function(error) {
		$scope.bluetooth.errorMessage = error;
	});

	$scope.discover = function() {
		$bluetooth.isEnabled().then( function(response) {
			$scope.bluetooth.loading = true;
			// Découverte des périphériques
			$bluetooth.list().then( function(response) {
				$scope.bluetooth.loading = false;
				if (response.length > 0) {
					$scope.bluetooth.errorMessage = '';
					//console.log(JSON.stringify(response, null, 4));
					angular.forEach(response, function(device, key) {
						this[device.id] = device;
					}, $scope.bluetooth.deviceList);
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

	$scope.connect = function(id) {
		$bluetooth.isEnabled().then( function(response) {
			// Tentative de connexion
			$scope.bluetooth.loading = true;
			$bluetooth.connect(id).then( function(response) {
				$scope.bluetooth.loading = false;
				$scope.bluetooth.errorMessage = '';
				//$scope.bluetooth.connected = true;
				$scope.bluetooth.deviceList[id].connected = true;
				// Sauvegarde de l'appareil connecté
				if ($rootScope.$storage.deviceList === undefined) {
					$rootScope.$storage.deviceList = {};
				}
				$rootScope.$storage.deviceList[id] = $scope.bluetooth.deviceList[id];
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
		$bluetooth.isConnected().then( function(a) {
			console.log(a);
			// Déconnexion ?
			$scope.bluetooth.loading = true;
			$bluetooth.disconnect().then( function(response) {
				$scope.bluetooth.loading = false;
				$scope.bluetooth.errorMessage = '';
				//$scope.bluetooth.connected = false;
				$scope.bluetooth.deviceList[id].connected = false;
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
			console.log(data);
			$scope.bluetooth.loading = true;
			$bluetooth.write(data).then( function(response) {
				$scope.bluetooth.loading = false;
				console.log(response);
			}, function(error) {
				$scope.bluetooth.loading = false;
				console.log(error);
				alert(error);
			});
		}
	};

	$scope.available = function() {
		$scope.bluetooth.loading = true;
		$bluetooth.available().then( function(response) {
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
		$bluetooth.read().then( function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			alert(error);
		});
	};


	$scope.readUntil = function() {
		$scope.bluetooth.loading = true;
		$bluetooth.readUntil('\n').then( function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			alert(error);
		});
	};

	$scope.subscribe = function() {
		$scope.bluetooth.loading = true;
		$bluetooth.subscribe('\n').then( function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			alert(error);
		});
	};

	$scope.unsubscribe = function() {
		$scope.bluetooth.loading = true;
		$bluetooth.unsubscribe().then( function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			alert(error);
		});
	};

	$scope.clear = function() {
		$scope.bluetooth.loading = true;
		$bluetooth.clear().then( function(response) {
			$scope.bluetooth.loading = false;
			console.log(response);
			alert(response);
		}, function(error) {
			$scope.bluetooth.loading = false;
			console.log(error);
			alert(error);
		});
	};

	// Local Storage
	if ($rootScope.$storage.deviceList !== undefined) {
		// Restitution des derniers appareils connectés
		angular.forEach($rootScope.$storage.deviceList, function(device, key) {
			device.stored = true;
			device.connected = false;
			this[device.id] = device;
		}, $scope.bluetooth.deviceList);
	}

}]);
