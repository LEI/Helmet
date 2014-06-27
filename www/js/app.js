'use strict';

angular.module('helmetApp', [
	'ionic',
	'ngRoute',
	'ngSanitize',
	'ngStorage',
	'angularMoment',
	'angles'
])

.config([
	'$routeProvider',
	'$provide',
function($routeProvider, $provide) {

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
			controller: 'SettingsController'
		})
		.otherwise({
			redirectTo: '/direction'
		});

	//$locationProvider.html5Mode(true);

	/*$provide.decorator('$route', function($delegate) {

	    $delegate.getRoute = function(name) {
	        var result = null;
	        angular.forEach($delegate.routes, function(config, route) {
	            if (config.name === name) {
	                result = route;
	            }
	        });
	        return result;
	    };

	    return $delegate;
	});*/

}])

/*.run(function($direction) {
	console.log($direction);
})*/

.controller('AppController', [
	'$rootScope',
	'$scope',
	'$route',
	'$window',
	'$location',
	'$localStorage',
function($rootScope, $scope, $route, $window, $location, $localStorage) {

	// $scope.getActiveRoute = function(name) {
	// 	return $route.getRoute(name) ? ' active' : '';
	// }


	var logo = {
		type: 'button-clear',
		content: '<img src="img/logo.png" height="34" alt="Helmet Visio">',
		tap: function(e) {
			$scope.go('direction');
		}
	};
	$scope.rightButtons = [logo];
	$scope.go = function(path) {
		if ($location.path() !== '/'+path) {
			$scope.rightButtons = [logo];
		}
		$location.path( path );
	};
	$scope.goBack = function(callback) {
		$scope.rightButtons = [];
		$scope.rightButtons.push({
			type: 'button-clear',
			content: '<i class="ion-close"></i>',
			tap: function(e) {
				callback();
				$scope.rightButtons = [logo];
			}
		});
	}

	$scope.leftButtons = [{
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

	// Local Storage
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
