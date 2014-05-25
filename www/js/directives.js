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
		link: function(scope, element, attrs) {
			var re = /(\.\.\.)$/,
				message = attrs.loadingMessage,
				count = 0;
			if (re.test(message)) {
				text = message.replace(re,'');
				var text, tick = $interval(function() {
					if (count++ % 4) {
						text += '.';
					} else {
						text = message.replace(re,'');
					}
					element.text(text);
					if ($rootScope.loading.position !== true) {
						$interval.cancel(tick);
					}
				}, 500);
			} else {
				element.text(message);
			}
			element.on('$destroy', function(){
			    if (tick !== undefined) {
			    	$interval.cancel(tick);
			    }
			});
		}
	}
}]);