'use strict';

angular.module('appHelmet.services', [])

.factory('geolocation', ['$rootScope', '$q', function ($rootScope, $q) {
	var currentPosition = function (onSuccess, onError, options) {
		var deferred = $q.defer();
		navigator.geolocation.getCurrentPosition(
		function (position) {
			/*var that = this,
				args = arguments;
			if (onSuccess) {
				$rootScope.$apply(function () {
					onSuccess.apply(that, args);
				});
			}*/
			deferred.resolve(position);
		}, function (error) {
			/*var that = this,
				args = arguments;
			if (onError) {
				$rootScope.$apply(function () {
					onError.apply(that, args);
				});
			}*/
			deferred.reject(error);
		},
		options);

		return deferred.promise;
	},
	watchedPosition = function(onSuccess, onError, options) {
		var deferred = $q.defer();
		navigator.geolocation.watchPosition(function (position) {
			/*var that = this,
				args = arguments;
			if (onSuccess) {
				$rootScope.$apply(function () {
					onSuccess.apply(that, args);
				});
			}*/
			deferred.resolve(position);
		}, function (error) {
			/*var that = this,
				args = arguments;
			if (onError) {
				$rootScope.$apply(function () {
					onError.apply(that, args);
				});
			}*/
			deferred.reject(error);
		},
		options);

		return deferred.promise;
	};

	return {
		getCurrentPosition: currentPosition,
		watchPosition: watchedPosition
	};
}])

.factory('openWeatherMap', ['$q', '$http', function($q, $http) {
	var currentWeather = function(position) {
		var deferred = $q.defer(),
			url = 'http://api.openweathermap.org/data/2.5/weather' +
			'?lang=fr' + '&u=c' + '&units=metric' + '&mode=json' +
			'&lat=' + position.coords.latitude +
			'&lon=' + position.coords.longitude;

		$http.get(url)
			.success(function(data, status) {
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
}])


.factory('directionsApi', ['$q', '$http', function($q, $http) {
	var direction = function(position, destination) {
		var deferred = $q.defer(),
			url = 'https://maps.googleapis.com/maps/api/directions/json?sensor=true' +
			'&origin=' + position.coords.latitude + ',' + position.coords.longitude +
			'&destination=' + destination;

		$http.get(url)
			.success(function(data, status) {
				deferred.resolve(data);
			})
			.error(function(data, status) {
				deferred.reject(data);
			});

		return deferred.promise;
	};

	return {
		getDirection: direction
	};
}]);