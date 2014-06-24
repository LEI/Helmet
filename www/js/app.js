'use strict';

angular.module('helmetApp', [
	'ionic',
	'ngRoute',
	'ngSanitize',
	'ngStorage',
	'angularMoment',
	'chartjs-directive'
])

.config([
	'$routeProvider',
function($routeProvider) {

	$routeProvider
		.when('/direction', {
			name: 'direction',
			templateUrl: 'views/direction.html',
			controller: 'DirectionController'
		})
		.when('/history/:date?', {
			name: 'history',
			templateUrl: 'views/history.html',
			controller: 'TripsController'
		})
		.when('/settings', {
			name: 'settings',
			templateUrl: 'views/settings.html',
			controller: 'ArduinoController'
		})
		.otherwise({
			redirectTo: '/direction'
		});

	//$locationProvider.html5Mode(true);

}])

/*.run(function($direction) {
	console.log($direction);
})*/

.controller('AppController', [
	'$rootScope',
	'$scope',
	'$window',
	'$location',
	'$localStorage',
function($rootScope, $scope, $window, $location, $localStorage) {

	$scope.go = function(path) {
		$scope.leftButtons = [];
		$location.path( path );
	};

	$scope.leftButtons = [];
	$scope.goBack = function(callback) {
		$scope.leftButtons = [];
		$scope.leftButtons.push({
			type: 'button-clear',
			content: '<i class="ion-chevron-left"></i>',
			tap: function(e) {
				callback();
				$scope.leftButtons = [];
			}
		});
	}

	$scope.rightButtons = [{
		type: 'button-clear',
		content: '<i class="ion-bluetooth"></i> Bluetooth',
		tap: function(e) {
			$scope.go('settings');
		}
	}, {
		type: 'button-clear',
		content: '<i class="ion-android-clock"></i> Historique',
		tap: function(e) {
			$scope.go('history');
		}
	}, {
		type: 'button-clear',
		content: '<i class="ion-navigate"></i> Itinéraire',
		tap: function(e) {
			$scope.go('direction');
		}
	}];
/*
	<ion-nav-buttons side="right">
	<ion-nav-buttons side="left">
		<button ng-click="go('history')" class="button button-icon ion-clock"></button>
		<button ng-click="go('settings')" class="button button-icon ion-bluetooth"></button>
	</ion-nav-buttons>
		<button ng-click="go('direction')" class="button button-icon ion-navigate"></button>
	</ion-nav-buttons>*/
	$rootScope.$storage = $localStorage;

	// Chargement : route, position, weather, direction
	$rootScope.loading = {};

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading.route = true;
		$rootScope.message = '';
	});

	$rootScope.$on("$routeChangeSuccess", function(){
		$rootScope.loading.route = false;
	});

	$scope.innerWidth = $window.innerWidth;
	angular.element($window).bind("resize",function(event){
		$scope.innerWidth = $window.innerWidth;
	});
}]);
