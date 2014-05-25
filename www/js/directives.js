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

.directive('haMap', function () {
	return {
		templateUrl: 'views/partials/map.html'
	};
})

.directive('haDirections', function () {
	return {
		templateUrl: 'views/partials/directions.html'
	};
})

.directive('haStep', function () {
	return {
		scope: {
			item: '=haStep',
			itemCount: '=stepCount',
			itemTotal: '=stepTotal'
		},
		templateUrl: 'views/partials/step.html'
	};
});