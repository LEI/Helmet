'use strict';

angular.module('helmetApp')

.factory('$storage', [
	'$rootScope',
	'$scope',
	'$localStorage',
function($rootScope, $scope, $localStorage) {

		// Local Storage
		// http://cordova.apache.org/docs/en/edge/cordova_storage_storage.md.html#Storage

		// https://github.com/gsklee/ngStorage
		//$scope.$storage = $localStorage;

		var localVar;

		return {
			add: function(data) {
				$scope.storage.push(data);
			}
		};
	}
]);
