'use strict';

angular.module('helmetApp')

.controller('TripsController', [
	'$q',
	'$scope',
	'$rootScope',
	'$location',
	'$timeout',
	'$direction',
	'$geolocation',
	'$localStorage',
	'FileSystem',
function($q, $scope, $rootScope, $location, $timeout, $direction, $geolocation, $localStorage, FileSystem) {


	$scope.getTrips = function() {
		FileSystem.read().then(function(response){
			$scope.tripList = {};
			angular.forEach(response.data, function(trip, key) {
				this[trip.date] = trip;
			}, $scope.tripList);
			// Affichage d'un trajet
			var t = $location.hash();
			if (t !== undefined && t !== '') {
				t = $scope.tripList[t]
				if (t !== undefined) {
					$scope.showTrip(t);
				}
			}
		}, function(error){
			$rootScope.message = error;
		});
	};

	$scope.getTrips();

	$scope.resetTrips = function() {
		FileSystem.write("",true);
		$scope.tripList = [];
	};

	$scope.showTrip = function(trip) {
		$scope.currentTrip = trip;
		$location.hash(trip.date);
		// Carte
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
				$rootScope.message = error;
			});
		}, function(error){
			$rootScope.message = error;
		});
	};

	$scope.hideTrip = function(trip) {
		$scope.currentTrip = false;
		$direction.resetMap();
		$location.hash('');
	};

}]);
