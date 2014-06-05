angular.module('helmetApp', [
	'ngRoute',
	'ngSanitize',
	'ngStorage',
	'mobile-angular-ui'
])

.config([
	'$routeProvider',
	'$locationProvider',
function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html'
		})
		.when('/direction/:direction?', {
			templateUrl: 'views/route.html',
			controller: 'DirectionController'
		})
		.when('/trips', {
			templateUrl: 'views/trips.html',
			controller: 'TripsController'
		})
		.when('/settings', {
			templateUrl: 'views/settings.html',
			controller: 'SettingsController'
		})
		.otherwise({
			redirectTo: '/'
		});

	//$locationProvider.html5Mode(true);

}])

.controller('AppController', [
	'$rootScope',
	'$scope',
	'$localStorage',
function($rootScope, $scope, $localStorage) {
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
}]);
