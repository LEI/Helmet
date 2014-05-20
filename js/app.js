angular.module('appHelmet', [
	'ui.router',
	'appHelmet.controllers'
])

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "views/home.html",
			controller: "HomeController"
		});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/');

});
