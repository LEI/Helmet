'use strict';

angular.module('helmetApp')

.filter('capitalize', function() {
	return function(input, scope) {
		//if (input!=null) { input = input.toLowerCase(); }
		return input.substring(0,1).toUpperCase()+input.substring(1);
	}
})

.filter('speed', function() {
	return function(input, unit) {
		if (input && unit) {
			return input.toFixed(2) + ' ' + unit;
		}
		return input;
	}
})

.filter('distance', function() {
	return function(input) {
		if (input >= 1000) {
			return (input/1000).toFixed(2) + ' km';
		} else {
			return input + ' m';
		}
	}
});