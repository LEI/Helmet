'use strict';

angular.module('helmetApp')

.factory('openWeatherApi', [
	'$q',
	'$http',
function($q, $http) {
	return {
		getCurrentWeather: function(position) {
			var deferred = $q.defer(),
				//url = 'http://api.openweathermap.org/data/2.5/weather';
				url ='http://api.openweathermap.org/data/2.5/weather?q=Paris,fr'
			// if (position === undefined) {
			// 	deferred.reject('Position inconnue');
			// 	return deferred.promise;
			// }

			$http.get(url, { method: 'GET',
				params: {
					mode: 'json', lang: 'fr',
					units: 'metric', u: 'c',
					//lat: position.coords.latitude,
					//lon: position.coords.longitude
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
	'$bluetooth',
	'openWeatherApi',
function($scope, $geolocation, $bluetooth, openWeatherApi) {
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
				weather: data.weather[0]
			};
			// Gestion alertes
			// if (data.main.temp < 3) {
			// 	$bluetooth.write('TEMP:'+data.main.temp);
			// }
			var weatherAlert = [];
			angular.forEach(data.weather, function(weather, key) {
				switch (weather.id) {
					case 200:
						weatherAlert.push(weather.description);
						break;
					case 201:
						weatherAlert.push(weather.description);
						break;
					case 202:
						weatherAlert.push(weather.description);
						break;
					case 210:
						weatherAlert.push(weather.description);
						break;
					case 211:
						weatherAlert.push(weather.description);
						break;
					case 212:
						weatherAlert.push(weather.description);
						break;
					case 221:
						weatherAlert.push(weather.description);
						break;
					case 230:
						weatherAlert.push(weather.description);
						break;
					case 231:
						weatherAlert.push(weather.description);
						break;
					case 232:
						weatherAlert.push(weather.description);
						break;
					case 300:
						weatherAlert.push(weather.description);
						break;
					case 301:
						weatherAlert.push(weather.description);
						break;
					case 302:
						weatherAlert.push(weather.description);
						break;
					case 310:
						weatherAlert.push(weather.description);
						break;
					case 311:
						weatherAlert.push(weather.description);
						break;
					case 312:
						weatherAlert.push(weather.description);
						break;
					case 313:
						weatherAlert.push(weather.description);
						break;
					case 314:
						weatherAlert.push(weather.description);
						break;
					case 321:
						weatherAlert.push(weather.description);
						break;
					case 500:
						weatherAlert.push(weather.description);
						break;
					case 501:
						weatherAlert.push(weather.description);
						break;
					case 502:
						weatherAlert.push(weather.description);
						break;
					case 503:
						weatherAlert.push(weather.description);
						break;
					case 504:
						weatherAlert.push(weather.description);
						break;
					case 511:
						weatherAlert.push(weather.description);
						break;
					case 520:
						weatherAlert.push(weather.description);
						break;
					case 521:
						weatherAlert.push(weather.description);
						break;
					case 522:
						weatherAlert.push(weather.description);
						break;
					case 531:
						weatherAlert.push(weather.description);
						break;
					case 600:
						weatherAlert.push(weather.description);
						break;
					case 601:
						weatherAlert.push(weather.description);
						break;
					case 602:
						weatherAlert.push(weather.description);
						break;
					case 611:
						weatherAlert.push(weather.description);
						break;
					case 612:
						weatherAlert.push(weather.description);
						break;
					case 615:
						weatherAlert.push(weather.description);
						break;
					case 616:
						weatherAlert.push(weather.description);
						break;
					case 620:
						weatherAlert.push(weather.description);
						break;
					case 621:
						weatherAlert.push(weather.description);
						break;
					case 622:
						weatherAlert.push(weather.description);
						break;
					case 701:
						weatherAlert.push(weather.description);
						break;
					case 711:
						weatherAlert.push(weather.description);
						break;
					case 721:
						weatherAlert.push(weather.description);
						break;
					case 731:
						weatherAlert.push(weather.description);
						break;
					case 741:
						weatherAlert.push(weather.description);
						break;
					case 751:
						weatherAlert.push(weather.description);
						break;
					case 761:
						weatherAlert.push(weather.description);
						break;
					case 762:
						weatherAlert.push(weather.description);
						break;
					case 771:
						weatherAlert.push(weather.description);
						break;
					case 781:
						weatherAlert.push(weather.description);
						break;
					case 900:
						weatherAlert.push(weather.description);
						break;
					case 901:
						weatherAlert.push(weather.description);
						break;
					case 902:
						weatherAlert.push(weather.description);
						break;
					case 903:
						weatherAlert.push(weather.description);
						break;
					case 904:
						weatherAlert.push(weather.description);
						break;
					case 905:
						weatherAlert.push(weather.description);
						break;
					case 906:
						weatherAlert.push(weather.description);
						break;
					case 952:
						weatherAlert.push(weather.description);
						break;
					case 953:
						weatherAlert.push(weather.description);
						break;
					case 954:
						weatherAlert.push(weather.description);
						break;
					case 955:
						weatherAlert.push(weather.description);
						break;
					case 956:
						weatherAlert.push(weather.description);
						break;
					case 957:
						weatherAlert.push(weather.description);
						break;
					case 958:
						weatherAlert.push(weather.description);
						break;
					case 959:
						weatherAlert.push(weather.description);
						break;
					case 960:
						weatherAlert.push(weather.description);
						break;
					case 961:
						weatherAlert.push(weather.description);
						break;
					case 962:
						weatherAlert.push(weather.description);
						break;
				}
			});
			console.log(data.weather[0].description);
			console.log(weatherAlert.join(', '));
			// $bluetooth.write('WEATHER:'+weatherAlert.join(', ')).then(function(response) {
			// 	console.log('Réponse reçue: ' + response);
			// }, function(error) {
			// 	console.log(error);
			// });

		}, function(error) {
			$scope.currentWeather.loading = false;
			$scope.currentWeather.errorMessage = error || 'Erreur Open Weather Api';
		});
	}, function(error) {
		$scope.currentWeather.loading = false;
		$scope.currentWeather.errorMessage = error || 'Erreur position';
	});
}]);