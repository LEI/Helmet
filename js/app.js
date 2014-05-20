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
		})
		/*.state('state1.list', {
			url: "/list",
			templateUrl: "partials/state1.list.html",
			controller: function($scope) {
			$scope.items = ["A", "List", "Of", "Items"];
			}
		})
		.state('state2', {
			url: "/state2",
			templateUrl: "partials/state2.html"
		})
		.state('state2.list', {
			url: "/list",
			templateUrl: "partials/state2.list.html",
			controller: function($scope) {
			$scope.things = ["A", "Set", "Of", "Things"];
			}
		})*/;

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/');

});
