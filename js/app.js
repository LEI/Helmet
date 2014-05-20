angular.module('appHelmet', [
	'ngSanitize',
	'ngRoute',
	'mobile-angular-ui',
	'appHelmet.controllers',
	'appHelmet.directives'
])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html'
		})
		.when('/route', {
			templateUrl: 'views/route.html',
			controller: 'RouteController'
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

}]);
