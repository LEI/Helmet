'use strict';

angular.module('helmetApp')

.directive('haPosition', [function() {
	return {
		templateUrl: 'views/partials/position.html'
	};
}])

.directive('haWeather', [function() {
	return {
		controller: 'openWeatherController',
		templateUrl: 'views/partials/weather.html'
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