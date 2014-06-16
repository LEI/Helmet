'use strict';

angular.module('helmetApp')

.factory('$notification', [
	'$rootScope',
	'$timeout',
function($rootScope, $timeout) {
		return {
			alert: function(message, title, buttonName, callback) {
				if (navigator.notification) {
					$timeout(function(){
						navigator.notification.alert(message, function () {
							var that = this, args = arguments;
							$rootScope.$apply(function () {
								callback.apply(that, args);
							});
						}, title, buttonName);
					});
				} else {
					this.fallbackAlert(title, message);
				}
			},
			confirm: function(message, title, buttonLabels, callback) {
				if (navigator.notification) {
					navigator.notification.alert(message, function () {
						var that = this, args = arguments;
						$rootScope.$apply(function () {
							callback.apply(that, args);
						});
					}, title, buttonLabels);
				} else {
					this.fallbackAlert(title, message);
				}
			},
			beep: function (times) {
				if (navigator.notification)
					navigator.notification.beep(times);
			},
			vibrate: function (milliseconds) {
				// <uses-permission android:name="android.permission.VIBRATE" />
				if (navigator.notification)
					navigator.notification.vibrate(milliseconds);
			},
			fallbackAlert: function(title, message) {
				alert(title + ': ' + message);
			}
		};
	}
]);
