'use strict';

angular.module('helmetApp')

/*
 *	Bluetooth Serial Port
 */
.factory('$bluetooth', [
	'$q',
	'$rootScope',
	'$notification',
function($q, $rootScope, $notification) {
	return {
		isEnabled: function(hideAlert) {
			var deferred = $q.defer();
			if ('bluetoothSerial' in window) {
				bluetoothSerial.isEnabled(
					function(response) { deferred.resolve(response); },
					function(error) { deferred.reject(error); }
				);
			} else {
				deferred.reject('Bluetooth indisponible');
				if (!hideAlert) {
					$notification.alert( // message, titre, bouton, callback
						'Activez le bluetooth et associez les périphériques depuis les paramètres :\n'
						+ 'Paramètres > Sans fil et réseaux',
						'Bluetooth', 'OK');
				}
			}

			return deferred.promise;
		},
		isConnected: function() {
			var deferred = $q.defer();
			bluetoothSerial.isConnected(
				function(response) { deferred.resolve(response); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		deviceList: [],
		list: function() {
			var that = this, deferred = $q.defer();
			bluetoothSerial.list(
				function(devices) {

					angular.forEach(devices, function(device, key) {
						this[device.id] = device;
					}, that.deviceList);

					deferred.resolve(devices);
				},
				function(error) {
					deferred.reject(error);
				}
			);

			return deferred.promise;
		},
		connect: function(macAddress) {
			var deferred = $q.defer();
			bluetoothSerial.connect(
				macAddress,
				function(response) { deferred.resolve(response); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		connectInsecure: function(macAddress) {
			var deferred = $q.defer();
			bluetoothSerial.connectInsecure(
				macAddress,
				function(response) { deferred.resolve(response); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		disconnect: function() {
			var deferred = $q.defer();
			bluetoothSerial.disconnect(
				function(response) { deferred.resolve(response); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		write: function(data) {
			var deferred = $q.defer();
			bluetoothSerial.isConnected(
				function(response) {
					bluetoothSerial.write(
						data,
						function(response) { deferred.resolve(response); },
						function(error) { deferred.reject(error); }
					);
				},
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		available: function() {
			var deferred = $q.defer();
			bluetoothSerial.available(
				function(response) {
					console.log("There are " + response + " available to read.");
					deferred.resolve(response);
				},
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		read: function() {
			var deferred = $q.defer();
			bluetoothSerial.read(
				function(data) { deferred.resolve(data); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		readUntil: function(delimiter) {
			var deferred = $q.defer();
			bluetoothSerial.readUntil(
				delimiter || '\n',
				function(data) { deferred.resolve(data); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		subscribe: function(delimiter) {
			var deferred = $q.defer();
			bluetoothSerial.subscribe(
				delimiter || '\n',
				function(data) { deferred.resolve(data); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		unsubscribe: function() {
			var deferred = $q.defer();
			bluetoothSerial.unsubscribe(
				function(response) { deferred.resolve(response); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		},
		clear: function() {
			var deferred = $q.defer();
			bluetoothSerial.clear(
				function(response) { deferred.resolve(response); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		}
		/*readRSSI: function() {
			var deferred = $q.defer();
			bluetoothSerial.readRSSI(
				function(response) { deferred.resolve(response); },
				function(error) { deferred.reject(error); }
			);

			return deferred.promise;
		}*/
	};
}]);
