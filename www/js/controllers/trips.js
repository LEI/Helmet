'use strict';

angular.module('helmetApp')

.controller('TripsController', [
	'$q',
	'$scope',
	'$rootScope',
	'$location',
	'$routeParams',
	'$timeout',
	'$direction',
	'$geolocation',
	'$localStorage',
	'FileSystem',
function($q, $scope, $rootScope, $location, $routeParams, $timeout, $direction, $geolocation, $localStorage, FileSystem) {

	$scope.fileLoading = true;

	// Initialisation des trajets
	($scope.getTrips = function() {
		FileSystem.read().then(function(response){
			$scope.fileLoading = false;
			if (response.data.length === 0) {
				$scope.tripList = false;
			} else {
				$scope.tripList = {};
				angular.forEach(response.data, function(trip, key) {
					this[trip.date] = trip;
				}, $scope.tripList);
				// Affichage d'un trajet
				var t = $routeParams.date;
				if (t !== undefined) {
					t = $scope.tripList[t]
					if (t !== undefined) {
						$scope.showTrip(t);
					}
				}
			}
		}, function(error){
			$rootScope.message = error;
		});
	})();

	($scope.initGraph = function() {
		$scope.speedGraph = {
			options: {
				animation: false,
				barShowStroke: false
			},
			data: {
				labels: [],
				datasets: []
			}
		};
	})();

	// Détais d'un trajet
	$scope.showTrip = function(trip) {
		$scope.currentTrip = trip;
		$scope.speedGraph.data = trip.speedGraph;
		$location.path('history/'+trip.date);
		$scope.goBack($scope.hideTrip);
		// Carte
		$direction.initMap(trip.end).then(function(){
			// Recherche de l'itinéraire
			$direction._getDirection(trip.start, trip.end, true).then(function(direction) {
				// Affichage carte
				$direction.displayDirection(direction);
			}, function(error) {
				$rootScope.message = error;
			});
		}, function(error){
			$rootScope.message = error;
		});
	};

	// Masque les détails
	$scope.hideTrip = function() {
		$scope.currentTrip = false;
		$scope.initGraph();
		$direction.resetMap();
		$location.path('history');
	};

	// Efface tous les trajets
	$scope.resetTrips = function() {
		FileSystem.write("",true);
		$scope.tripList = false;
	};

}]);
