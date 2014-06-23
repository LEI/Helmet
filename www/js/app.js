angular.module('helmetApp', [
	'ngRoute',
	'ngSanitize',
	'ngStorage',
	'angularMoment',
	'chartjs-directive',
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
			controller: 'ArduinoController'
		})
		.otherwise({
			redirectTo: '/'
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
	'$localStorage',
function($rootScope, $scope, $window, $localStorage) {

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
