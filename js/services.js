'use strict';

angular.module('helmetApp.services', [])

.factory('geolocation', [
	'$rootScope',
	'$q',
function ($rootScope, $q) {
	// options
	/*{
		timeout: 5000,
		enableHighAccuracy: true,
		maximumAge: 0
	}*/
	var currentPosition = function (onSuccess, onError, options) {
		var deferred = $q.defer();
		navigator.geolocation.getCurrentPosition(
		function (position) {
			var that = this,
				args = arguments;
			if (onSuccess) {
				$rootScope.$apply(function () {
					onSuccess.apply(that, args);
				});
			}
			deferred.resolve(position);
		}, function (error) {
			var that = this,
				args = arguments;
			if (onError) {
				$rootScope.$apply(function () {
					onError.apply(that, args);
				});
			}
			deferred.reject(error);
		},
		options);

		return deferred.promise;
	},
	watchedPosition = function(onSuccess, onError, options) {
		var deferred = $q.defer();
		navigator.geolocation.watchPosition(function (position) {
			var that = this,
				args = arguments;
			if (onSuccess) {
				$rootScope.$apply(function () {
					onSuccess.apply(that, args);
				});
			}
			deferred.resolve(position);
		}, function (error) {
			var that = this,
				args = arguments;
			if (onError) {
				$rootScope.$apply(function () {
					onError.apply(that, args);
				});
			}
			deferred.reject(error);
		},
		options);

		return deferred.promise;
	};

	// if (!navigator.geolocation) {
	// 	return false;
	// }

	return {
		getCurrentPosition: currentPosition,
		watchPosition: watchedPosition
	};
}])

.factory('openWeatherApi', [
	'$q',
	'$http',
function($q, $http) {
	var currentWeather = function(position) {
		var deferred = $q.defer(),
			url = 'http://api.openweathermap.org/data/2.5/weather';

		$http.get(url, { method: 'GET',
			params: {
				mode: 'json', lang: 'fr',
				units: 'metric', u: 'c',
				lat: position.coords.latitude,
				lon: position.coords.longitude
			}
		}).success(function(data, status) {
			deferred.resolve(data);
		}).error(function(data, status) {
			deferred.reject(data);
		});

		return deferred.promise;
	};

	return {
		getCurrentWeather: currentWeather
	};
}])

.factory('directionsApi', [
	'$q',
	'$http',
function($q, $http) {
	var direction = function(position, destination) {
		var deferred = $q.defer(),
			url = 'https://maps.google.fr/maps/api/directions/json',
			start = position.coords.latitude + ',' + position.coords.longitude;

		$http.get(url, { method: 'GET',
			params: {
				origin: start,
				destination: destination,
				sensor: true // ...
			}
		}).success(function(data, status) {
			deferred.resolve(data);
		}).error(function(data, status) {
			deferred.reject(data);
		});

		return deferred.promise;
	};

	return {
		getDirection: direction
	};
}]);