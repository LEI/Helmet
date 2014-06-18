'use strict';

angular.module('helmetApp')

.controller('TripsController', [
	'$q',
	'$scope',
	'$rootScope',
	'$timeout',
	'$localStorage',
	'FileSystem',
function($q, $scope, $rootScope, $timeout, $localStorage, FileSystem) {

	$rootScope.$storage = $localStorage;

	FileSystem.write("kikou");
	FileSystem.read().then(function(response){
		console.log(response);
		$scope.tripList = response;
	}, function(error){
		console.log(error);
	});
}]);
