'use strict';

angular.module('appHelmet.services', [])

.factory('geolocation', ['$rootScope', function ($rootScope) {
	var currentPosition = function (onSuccess, onError, options) {

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
	watchedPosition = function(onSuccess, onError, options) {
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
	};

	return {
		getCurrentPosition: currentPosition,
		watchPosition: watchedPosition
	};
}])

.factory('openWeatherMap', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
	var currentWeather = function(position) {
		var deferred = $q.defer();

		var url = 'http://api.openweathermap.org/data/2.5/weather' +
			'?lat=' + position.coords.latitude +
			'&lon=' + position.coords.longitude +
			'&lang=fr';

		$http.get(url)
			.success(function(data, status) {
				console.log(data);
				deferred.resolve(data);
			})
			.error(function(data, status) {
				deferred.reject(data);
			});

		return deferred.promise;
	};

	return {
		getCurrentWeather: currentWeather
	};
}]);