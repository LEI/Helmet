'use strict';

angular.module('helmetApp.directives', [])

.directive('btIcon', [function() {
	return {
		template: '<i class="fa fa-signal"></i>'
	};
}])

.directive('haWeather', [function() {
	return {
		templateUrl: 'views/partials/weather.html'
	};
}])

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

.directive('loadingMessage', ['$rootScope', '$interval', function($rootScope, $interval) {
	return {
		scope: {
			loadingMessage: '='
		},
		link: function(scope, element, attrs) {

			var message = scope.message = scope.loadingMessage,
				re = /(\.\.\.)$/,
				count = 0;
			element.text(scope.message);
			if (re.test(scope.message)) {
				var text, tick = $interval(function() {
					if (message != scope.loadingMessage) {
						if (!re.test(scope.message)) {
							$interval.cancel(tick);
						}
						message = scope.message = scope.loadingMessage;
					}
					scope.message = scope.message.replace(re,'');
					scope.message += '.';
					element.text(scope.message);
				}, 500);
			} else {
				element.text(scope.loadingMessage);
			}
			element.on('$destroy', function(){
				if (tick !== undefined) {
					$interval.cancel(tick);
				}
			});
		}
	}
}]);