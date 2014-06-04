'use strict';

angular.module('helmetApp')

.controller('SettingsController', [
	'$scope',
	'$rootScope',
	'$timeout',
	'$q',
	'$bluetooth',
function($scope, $rootScope, $timeout, $q, $bluetooth) {

	/*
	 *	Bluetooth
	 */

	$scope.bluetooth = {
		deviceList: {},
		connected: false,
		loading: false,
		errorMessage: ''
	};

	$bluetooth.isEnabled().then(function() {}, function(error) {
		$scope.bluetooth.errorMessage = error;
	});

	$scope.discover = function() {
		$bluetooth.isEnabled().then( function(response) {
			$scope.bluetooth.loading = true;
			// Découverte des périphériques
			$bluetooth.list().then( function(response) {
				$scope.bluetooth.loading = false;
				if (response.length > 0) {
					//console.log(JSON.stringify(response, null, 4));
					angular.forEach(response, function(value, key) {
						this[value.id] = value;
					}, $scope.bluetooth.deviceList);
				} else {
					$scope.bluetooth.errorMessage = 'Aucun périphérique';
				}
			}, function(error) {
				$scope.bluetooth.loading = false;
				$scope.bluetooth.errorMessage = error;
			});
		}, function(error) {
			$scope.bluetooth.errorMessage = error;
			if (navigator.notification) {
				navigator.notification.alert(
					'Veuillez activer le Bluetooth et associer les périphériques requis\n' + 'Paramètres > Sans fil et réseaux',
					test,
					'Bluetooth désactivé',
					'OK'
				);
			}
		});
	};

	$scope.connect = function(id) {
		$scope.bluetooth.loading = true;
		$bluetooth.connect(id).then( function(response) {
			$scope.bluetooth.loading = false;
			$scope.bluetooth.connected = true;
			$scope.bluetooth.deviceList[id].connected = true;
		}, function(error) {
			$scope.bluetooth.loading = false;
			$scope.bluetooth.errorMessage = error; // 'Connexion impossible'
		});
	};

	$scope.disconnect = function(id) {
		$bluetooth.isConnected().then( function(a) {
			console.log(a);
			$scope.bluetooth.loading = true;
			$bluetooth.disconnect().then( function(response) {
				$scope.bluetooth.loading = false;
				$scope.bluetooth.connected = false;
				$scope.bluetooth.deviceList[id].connected = false;
			}, function(error) {
				$scope.bluetooth.loading = false;
				$scope.bluetooth.errorMessage = error;
				alert(error);
			});
		});
	};

	/*$scope.check = function() {
		$bluetooth.isConnected().then( function(response) {
			console.log(response);
			alert(response);
		}, function(error) {
			console.log(error);
			alert(error);
		});
	};*/

	$scope.write = function(data) {
		console.log(data);
		$bluetooth.write(data).then( function(response) {
			console.log(response);
		}, function(error) {
			console.log(error);
			alert(error);
		});
	};

}]);
