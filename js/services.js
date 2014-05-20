'use strict';

angular.module('appHelmet.services', [])

.factory('geolocation', function ($rootScope) {
	return {
		getCurrentPosition: function (onSuccess, onError, options) {
			navigator.geolocation.getCurrentPosition(function () {
				var that = this,
					args = arguments;

				if (onSuccess) {
					$rootScope.$apply(function () {
						onSuccess.apply(that, args);
					});
				}
			}, function () {
				var that = this,
					args = arguments;

				if (onError) {
					$rootScope.$apply(function () {
						onError.apply(that, args);
					});
				}
			},
			options);
		},
		watchPosition: function(onSuccess, onError, options) {
			navigator.geolocation.watchPosition(function () {
				var that = this,
					args = arguments;

				if (onSuccess) {
					$rootScope.$apply(function () {
						onSuccess.apply(that, args);
					});
				}
			}, function () {
				var that = this,
					args = arguments;

				if (onError) {
					$rootScope.$apply(function () {
						onError.apply(that, args);
					});
				}
			},
			options);
		}
	};
});