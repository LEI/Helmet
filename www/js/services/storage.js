'use strict';

angular.module('helmetApp')

.factory('$storage', [
	'$rootScope',
	'$scope',
	function($rootScope, $scope) {

		// Local Storage
		// http://cordova.apache.org/docs/en/edge/cordova_storage_storage.md.html#Storage
		var localVar;

		return {
			storage: [],
			add: function(data) {
				this.storage.push(data);
			}
		};
	}
]);
