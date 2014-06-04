
'use strict';

angular.module('helmetApp')

.factory('openWeatherApi', [
	'$q',
	'$http',
function($q, $http) {
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
}])

.controller('openWeatherController', [
	'$scope',
	'$geolocation',
	'openWeatherApi',
function($scope, $geolocation, openWeatherApi) {
	$scope.currentWeather = {};
	// Attente de la position
	$scope.currentWeather.loading = true;
	$geolocation.getCurrentPosition().then( function(position) {
		// Recherche de la météo
		openWeatherApi.getCurrentWeather(position).then(function(data) {
			$scope.currentWeather.loading = false;
			$scope.currentWeather = {
				city: data.name,
				main: data.main,
				data: data.weather
			};
		}, function(error) {
			$scope.currentWeather.loading = false;
			$scope.currentWeather.errorMessage = error || 'Erreur Open Weather Api';
		});
	}, function(error) {
		$scope.currentWeather.loading = false;
		$scope.currentWeather.errorMessage = error || 'Erreur position';
	});
}]);