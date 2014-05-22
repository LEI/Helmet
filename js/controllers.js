'use strict';

angular.module('helmetApp.controllers', [
	'helmetApp.services'
])

.controller('AppController', [
	'$rootScope',
	'$scope',
function($rootScope, $scope) {

	$scope.test = 'Hello World';

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});
	$rootScope.$on("$routeChangeSuccess", function(){
		$rootScope.loading = false;
	});

}])

.controller('WeatherController', [
	'$scope',
	'geolocation',
	'openWeatherApi',
function($scope, geolocation, openWeatherApi) {
	// Recherche de la position
	geolocation.getCurrentPosition().then(function(position) {
		// Récupération de la météo
		openWeatherApi.getCurrentWeather(position).then(function(data) {
			$scope.currentWeather = {
				city: data.name,
				main: data.main,
				data: data.weather
			};
		});
	});
}])

.controller('DirectionController', [
	'$rootScope',
	'$scope',
	'geolocation',
function($rootScope, $scope, geolocation) {
	geolocation.getCurrentPosition().then(function(position) {
		$rootScope.position = position;

		var currentLatLng = {
			lat: $rootScope.position.coords.latitude,
			lng: $rootScope.position.coords.longitude
		},
		directionsDisplay = new google.maps.DirectionsRenderer(),
		directionsService = new google.maps.DirectionsService(),
		geocoder = new google.maps.Geocoder(),
		map, marker, infowindow;

		$scope.origin = currentLatLng;

		$scope.init = function () {
			var mapOptions = {
				zoom: $scope.zoom !== undefined ? $scope.zoom : 15,
				mapTypeId: 'roadmap',
				streetViewControl: false
			};
			map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
			$scope.endPoint = $scope.destination !== undefined ? $scope.destination : 'Paris';

			//scope.origin = $scope.origin !== undefined ? $scope.origin : 'Gennevilliers';

			map.setCenter($scope.origin);
			marker = new google.maps.Marker({
				map: map,
				position: $scope.origin,
				animation: google.maps.Animation.DROP
			});
			infowindow = new google.maps.InfoWindow({
				content: $scope.markerContent !== undefined ? $scope.markerContent : 'Vous êtes ici'
			});
			google.maps.event.addListener(marker, 'click', function () {
				return infowindow.open(map, marker);
			});
			/*geocoder.geocode({
				address: $scope.endPoint
			}, function (results, status) {
				var location = results[0].geometry.location;
				if (status === google.maps.GeocoderStatus.OK)
					map.setCenter(location);
					marker = new google.maps.Marker({
						map: map,
						position: location,
						animation: google.maps.Animation.DROP
					});
					infowindow = new google.maps.InfoWindow({
						content: $scope.markerContent !== undefined ? $scope.markerContent : 'Destination'
					});
					google.maps.event.addListener(marker, 'click', function () {
						return infowindow.open(map, marker);
					});
				} else {
					alert('Cannot Geocode');
				}
			});*/


		};
		$scope.init();
		$scope.getDirections = function () {
			var request = {
				origin: $rootScope.position.coords.latitude + ',' + $rootScope.position.coords.longitude,
				destination: $scope.endPoint,
				travelMode: google.maps.DirectionsTravelMode.DRIVING,
				unitSystem : google.maps.UnitSystem.METRIC,
				region: 'UK'
			};
			directionsService.route(request, function (response, status) {
				if (status === google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response)
					document.getElementById('wrongAddress').style.display = "none";
				} else {
					document.getElementById('wrongAddress').style.display = "block";
				}
			});
			directionsDisplay.setMap(map);

			directionsDisplay.setPanel(document.getElementById('directionsList'));

		};
		$scope.clearDirections = function () {
			$scope.init();
			directionsDisplay.setPanel(null);
			$scope.origin = {
				lat: $rootScope.position.coords.latitude,
				lng: $rootScope.position.coords.longitude
			};
		};
	});
}])

.controller('RouteController', [
	'$rootScope',
	'$scope',
	'geolocation',
	'directionsApi',
function($rootScope, $scope, geolocation, directionsApi) {

	if (navigator.geolocation) {

		$scope.test = {
			title: 'Recherche en cours...',
			count: 0,
			watchPosition: 'Position'
		};

		var watchId = geolocation.watchPosition().then(function(position) {
			$rootScope.position = position;
			$scope.test.watchPosition += '<strong>watchPosition</strong><br>' +
				'Latitude: ' + position.coords.latitude + '<br>' +
				'Longitude: ' + position.coords.longitude + '<br>';
		});

		$scope.stop = function() {
			navigator.geolocation.clearWatch(watchId);
		};

		geolocation.getCurrentPosition().then(function(position) {
			$rootScope.position = position;
		});

		/*
		$scope.getDirection = function(position, destination) {
			directionsApi.getDirection(position, destination).then(function(direction) {
				if (direction != false) {
					$scope.destination += ' ' + direction.routes[0].legs[0].distance.text
										+ ' ' + direction.routes[0].legs[0].duration.text;
				} else {
					$scope.destination += 'falsh';
				}
			});
		};


		$scope.onTick = function() {
			// Get current position
			geolocation.getCurrentPosition().then(function(position) {
				$scope.test.count++;
				$rootScope.position = position;
				console.log(position);
			});
		};

		var tick = $interval($scope.onTick, 5000);

		$scope.$on('$destroy', function () {
			$interval.cancel(tick);
		});

		$scope.destroyInterval = function () {
			$interval.cancel(tick);
		};

		(function tick() {
			geolocation.getCurrentPosition().then(function(position) {
				$scope.test.count++;
				$rootScope.position = position;
				console.log(position);
				$timeout(tick, 1000);
			});
		})();*/

	} else {
		alert('FU');
	}

}]);