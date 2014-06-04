'use strict';

angular.module('helmetApp')

.directive('haPosition', [function() {
	return {
		templateUrl: 'views/partials/position.html'
	};
}])

.directive('haMap', [function () {
	return {
		templateUrl: 'views/partials/map.html'
	};
}])

.directive('haDirections', [function () {
	return {
		templateUrl: 'views/partials/directions.html'
	};
}])

.directive('haStep', [function () {
	return {
		scope: {
			item: '=haStep',
			itemCount: '=stepCount',
			itemTotal: '=stepTotal'
		},
		templateUrl: 'views/partials/step.html'
	};
}])

.directive('btIcon', [function() {
	return {
		template: '<i class="fa fa-signal"></i>'
	};
}])

.directive('haWeather', [
	'$rootScope',
	'$geolocation',
	'openWeatherApi',
function($rootScope, $geolocation, openWeatherApi) {
	return {
		restrict: 'EA',
		//templateUrl: 'views/partials/weather.html',
		controller: function($scope) {
			// Attente de la position
			$rootScope.loading.weather = true;
			$scope.currentWeather = {};
			$geolocation.getCurrentPosition().then( function(position) {
				// Recherche de la météo
				openWeatherApi.getCurrentWeather(position).then(function(data) {
					$rootScope.loading.weather = false;
					$scope.currentWeather = {
						city: data.name,
						main: data.main,
						data: data.weather
					};
				}, function(error) {
					$rootScope.loading.weather = false;
					$scope.currentWeather.errorMessage = error || 'Erreur';
				});
			}, function(error) {
				$scope.currentWeather.errorMessage = error;
			});
			/*$rootScope.$watch('waitPosition', function(newValue, oldValue, scope){});
				// newValue.coords.accuracy !== oldValue.coords.accuracy ?
				if (newValue !== undefined) {
					$rootScope.currentWeather = {};
					newValue.then(function() {
						// Recherche de la météo
						openWeatherApi.getCurrentWeather($rootScope.position).then(function(data) {
							$rootScope.loading.weather = false;
							$rootScope.currentWeather = {
								city: data.name,
								main: data.main,
								data: data.weather
							};
						}, function(error) {
							$rootScope.loading.weather = false;
							$rootScope.currentWeather.errorMessage = error;
						});
					}, function(error) {
						$rootScope.currentWeather.errorMessage = error;
					});
				}
			});*/
		}
	};
}])

.directive('loadingMessage', [
	'$rootScope',
	'$interval',
function($rootScope, $interval) {
	return {
		scope: {
			loadingMessage: '='
		},
		link: function(scope, element, attrs) {
			var tick, re = /(\.\.\.)$/,
				message = scope.message = scope.loadingMessage;
			// Affichage du texte
			element.text(scope.message);
			tick = $interval(function() {
				if (message != scope.loadingMessage) {
					// Message mis à jour
					message = scope.message = scope.loadingMessage;
				}
				// '...'
				if (re.test(scope.loadingMessage)) {
					scope.message = scope.message.replace(re,'');
					scope.message += '.';
				} else {
					$interval.cancel(tick);
				}
				// Mise à jour du texte
				element.text(scope.message);
			}, 500);
			// Stop $interval
			element.on('$destroy', function(){
				if (tick !== undefined) {
					$interval.cancel(tick);
				}
			});
		}
	}
}]);