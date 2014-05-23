'use strict';

angular.module('helmetApp.bluetooth', [])

.factory('bluetooth', [function() {
	if (typeof cordova !== 'undefined') {
		/*var deviceList = [],
		status = '';
		return {
			onDeviceList: function(devices) {
			        var option;
			        deviceList = [];
			        this.setStatus('');

			        for (var i = devices.length - 1; i >= 0; i--) {
			        	deviceList.push(devices[i]);

			        	//option.value = device.uuid || device.address
			        	//options.content = device.name
			        	//...

			        };

			    }
			}
		};
		return {
			list: function() {

				bluetoothSerial.list(this.ondevicelist, this.generateFailureFunction("List Failed"));
			},
			connect: function (deviceId) {
				bluetoothSerial.connect(deviceId, this.onconnect, this.ondisconnect);
			},
			disconnect: function(event) {
				if (event) {
					event.preventDefault();
				}

				this.setStatus("Disconnecting...");
				bluetoothSerial.disconnect(this.ondisconnect);
			},
			onconnect: function() {
				connectionScreen.hidden = true;
				colorScreen.hidden = false;
				this.setStatus("Connected.");
			},
			ondisconnect: function() {
				connectionScreen.hidden = false;
				colorScreen.hidden = true;
				this.setStatus("Disconnected.");
			},
			timeoutId: 0,
			setStatus: function(status) {
				if (this.timeoutId) {
					clearTimeout(this.timeoutId);
				}
				var messageDiv = status;
				this.timeoutId = setTimeout(function() { messageDiv = ""; }, 4000);
			},
			onDeviceList: function(devices) {
				var listItem, deviceId;

				// remove existing devices
				var deviceList = "";
				this.setStatus("");

				devices.forEach(function(device) {
					if (this.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
						deviceId = this.uuid;
					} else if (this.hasOwnProperty("address")) {
						deviceId = this.address;
					} else {
						deviceId = "ERROR " + JSON.stringify(this);
					}
					listItem.setAttribute('deviceId', this.address);
					listItem.innerHTML = this.name + "<br/><i>" + deviceId + "</i>";
					deviceList.appendChild(listItem);
				});

				if (devices.length === 0) {

					if (cordova.platformId === "ios") { // BLE
						this.setStatus("No Bluetooth Peripherals Discovered.");
					} else { // Android
						this.setStatus("Please Pair a Bluetooth Device.");
					}

				} else {
					this.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
				}
			},
			generateFailureFunction: function(message) {
				var func = function(reason) {
					var details = "";
					if (reason) {
						details += ": " + JSON.stringify(reason);
					}
					this.setStatus(message + details);
				};
				return func;
			}
		};*/
	}
}])

.controller('BluetoothController', [
	'$rootScope',
	'$scope',
	'bluetooth',
	function($rootScope, $scope, bluetooth) {

		//$scope.listDevices = bluetooth.list();

		$scope.connectToDevice = function(device) {
			//bluetooth.connect(device);
		};
		$scope.disconnect = function() {
			//bluetooth.disconnect();
		};


	}
]);
