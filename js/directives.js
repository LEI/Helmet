'use strict';

angular.module('helmetApp.directives', [])

.directive('haBluetooth', [function() {
	return {
		template: '<i class="fa fa-signal"></i> Bluetooth'
	};
}])

.directive('haWeather', [function() {
	return {
		templateUrl: 'views/weather.html'
	};
}]);