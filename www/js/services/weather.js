
'use strict';

angular.module('helmetApp')

.factory('openWeatherApi', [
	'$rootScope',
	'$q',
	'$http',
function($rootScope, $q, $http) {
	return {
		getCurrentWeather: function(position) {
			var deferred = $q.defer(),
				url = 'http://api.openweathermap.org/data/2.5/weather';

			if (position === undefined) {
				deferred.reject('Position inconnue');
				return deferred.promise;
			}

			$http.get(url, { method: 'GET',
				params: {
					mode: 'json', lang: 'fr',
					units: 'metric', u: 'c',
					lat: position.coords.latitude,
					lon: position.coords.longitude
				}
			}).success(function(response, status) {
				if (response.message === undefined) {
					deferred.resolve(response, status);
				} else {
					console.log(response);
					deferred.reject(response.cod + ' ' + response.message);
				}
			}).error(function(response, status) {
				deferred.reject(response, status);
			});

			return deferred.promise;
		}
	};
}]);