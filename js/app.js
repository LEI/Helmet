angular.module('appHelmet', [
	'ngSanitize',
	'ngRoute',
	'mobile-angular-ui',
	'appHelmet.controllers'
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
		.otherwise({
			redirectTo: '/'
		});

	//$locationProvider.html5Mode(true);

}]);
