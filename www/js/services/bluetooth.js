'use strict';

angular.module('helmetApp')

.factory('$bluetooth', [
	'$q',
function($q) {
	if ('bluetoothSerial' in window) {
		return {
			isEnabled: function() {
				var deferred = $q.defer();
				bluetoothSerial.isEnabled(
					function(response) { deferred.resolve(response); },
					function(error) { deferred.reject(error); }
				);

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
			list: function() {
				var deferred = $q.defer();//, deviceList = [];
				bluetoothSerial.list(
					function(devices) {
						/*for (var i = devices.length - 1; i >= 0; i--) {
							deviceList.push(devices[i]);
						};*/
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
				bluetoothSerial.write(
					data,
					function(response) { deferred.resolve(response); },
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
					function(data) {
						deferred.resolve(data);
					},
					function(error) { deferred.reject(error); }
				);

				return deferred.promise;
			},
			readUntil: function(delimiter) {
				delimiter = delimiter === undefined ? '\n' : delimiter;
				var deferred = $q.defer();
				bluetoothSerial.readUntil(
					delimiter,
					function(data) {
						deferred.resolve(data);
					},
					function(error) { deferred.reject(error); }
				);

				return deferred.promise;
			},
			subscribe: function(delimiter) {
				delimiter = delimiter === undefined ? '\n' : delimiter;
				var deferred = $q.defer();
				bluetoothSerial.subscribe(
					delimiter,
					function(data) {
						deferred.resolve(data);
					},
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
	}
	return {};
}]);
