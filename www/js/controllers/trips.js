'use strict';

angular.module('helmetApp')

.controller('TripsController', [
	'$q',
	'$scope',
	'$rootScope',
	'$timeout',
	'$direction',
	'$geolocation',
	'$localStorage',
	'FileSystem',
function($q, $scope, $rootScope, $timeout, $direction, $geolocation, $localStorage, FileSystem) {

	$scope.getTrips = function() {
		FileSystem.read().then(function(response){
			$scope.tripList = response.data;
		}, function(error){
			console.log(error);
		});
	};

	$scope.resetTrips = function() {
		FileSystem.write("",true);
		$scope.tripList = [];
	};

	$scope.showTrip = function(trip) {
		$scope.currentTrip = trip;

		$direction.initMap(trip.end).then(function(){
			// Recherche de l'itinéraire
			$direction._getDirection(
				trip.start,
				trip.end,
				true
			).then(function(direction) {
				// Affichage carte
				$direction.displayDirection(direction);
			}, function(error) {
				console.log(error);
			});
		},function(){
			console.log($direction);
		});
	};

	$scope.hideTrip = function(trip) {
		$scope.currentTrip = false;
		$direction.resetMap();
	};

	$scope.getTrips();

}]);
