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

	FileSystem.write({speed:2});
	
	//FileSystem.write("{data:[]}");

	// read, JSON.parse

	// var.push(obj)
	
	// JSON.stringify

	// save

	// FileSystem.write("{lol:1}");

/*
>>>>>>> 6ea8ed965a560ed4cfbf345dc1bc717e62fcbc68
	FileSystem.read().then(function(response){
		console.log(response);
		$scope.tripList = response;
	}, function(error){
		console.log(error);
	});
*/

}]);
