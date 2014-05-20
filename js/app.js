angular.module('appHelmet', [
	'ngSanitize',
	'ui.router',
	'mobile-angular-ui',
	'appHelmet.controllers'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "views/home.html"
		})
		.state('route', {
			url: "/route",
			templateUrl: "views/route.html",
			controller: "RouteController"
		})
		.state('route.start', {
			url: "/start",
			templateUrl: "views/route.start.html"
		})
		.state('route.list', {
			url: "/list",
			templateUrl: "views/route.list.html"
		});

	$urlRouterProvider.otherwise('/');

}]);
