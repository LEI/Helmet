'use strict';

angular.module('helmetApp.services', [])

.factory('geolocation', [
	'$rootScope',
	'$q',
function ($rootScope, $q) {
	var currentPosition = function (onSuccess, onError, options) {
		var deferred = $q.defer();
		navigator.geolocation.getCurrentPosition(
			function (position) {
				var that = this,
					args = arguments;
				if (onSuccess) {
					$rootScope.$apply(function () {
						onSuccess.apply(that, args);
					});
				}
				deferred.resolve(position);
			}, function (error) {
				var that = this,
					args = arguments;
				if (onError) {
					$rootScope.$apply(function () {
						onError.apply(that, args);
					});
				}
				deferred.reject(error.message ? error.message : error);
			},
		options || { timeout: 5000, enableHighAccuracy: true, maximumAge: 50000 });

		return deferred.promise;
	},
	watchedPosition = function(onSuccess, onError, options) {
		var deferred = $q.defer();
		navigator.geolocation.watchPosition(
			function (position) {
				var that = this,
					args = arguments;
				if (onSuccess) {
					$rootScope.$apply(function () {
						onSuccess.apply(that, args);
					});
				}
				deferred.resolve(position);
			}, function (error) {
				var that = this,
					args = arguments;
				if (onError) {
					$rootScope.$apply(function () {
						onError.apply(that, args);
					});
				}
				deferred.reject(error.message ? error.message : error);
			},
		options || { frequency: 3000 });

		return deferred.promise;
	};

	return {
		getCurrentPosition: currentPosition,
		watchPosition: watchedPosition
	};
}])

.factory('googleApi', [
	'$rootScope',
	'$q',
	'$http',
function($rootScope, $q, $http) {
	if (typeof google !== 'undefined') {
		var directionsDisplay = new google.maps.DirectionsRenderer(),
		geocoder = new google.maps.Geocoder(),
		marker, infowindow, knownDests = [],
		mapOptions = {
			zoom: 15,//$scope.zoom !== undefined ? $scope.zoom : 15,
			mapTypeId: 'roadmap',
			streetViewControl: false
		};
		return {
			initMap: function() {
				var origin = new google.maps.LatLng(
					$rootScope.position.coords.latitude,
					$rootScope.position.coords.longitude
				);
				$rootScope.map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
				$rootScope.map.setCenter(origin);
			},
			addMarker: function(location, popup) {
				popup = popup !== undefined ? popup : 'Hello You'
				marker = new google.maps.Marker({
					map: $rootScope.map,
					position: location,
					animation: google.maps.Animation.DROP
				});
				infowindow = new google.maps.InfoWindow({
					content: popup
				});
				google.maps.event.addListener(marker, 'click', function () {
					return infowindow.open($rootScope.map, marker);
				});
			},
			getDirections: function() {
				var origin, deferred = $q.defer(),
				directionsService = new google.maps.DirectionsService();
				angular.element(document.getElementById('google-map')).css('height','400px')
				function initDirection(latLng) {
					origin = $rootScope.position !== undefined ? new google.maps.LatLng(
						$rootScope.position.coords.latitude,
						$rootScope.position.coords.longitude
					) : 'Paname';
					directionsService.route({
						origin: origin,
						destination: latLng,
						travelMode: google.maps.DirectionsTravelMode.DRIVING,
						unitSystem : google.maps.UnitSystem.METRIC,
						region: 'FR',
						language: 'FR'
					}, function (response, status) {
						if (status === google.maps.DirectionsStatus.OK) {
							directionsDisplay.setDirections(response);
							deferred.resolve(response);
						} else {
							deferred.reject(status);
						}
					});
					directionsDisplay.setMap($rootScope.map);
					// Panel
					//directionsDisplay.setPanel(document.getElementById('directions-list'));
				}

				if (knownDests[$rootScope.destination] === undefined) {
					this.geocode($rootScope.destination).then(function(latLng) {
						knownDests[$rootScope.destination] = latLng;
						initDirection(latLng);
					}, function(error) {
						deferred.reject(error);
					});
				} else {
					initDirection(knownDests[$rootScope.destination]);
				}

				return deferred.promise;
			},
			clearDirections: function() {
				this.initMap();
				//directionsDisplay.setPanel(null);
			},
			geocode: function(address) {
				var deferred = $q.defer();
				geocoder.geocode({
					address: address
				}, function(response, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						deferred.resolve(response[0].geometry.location);
					} else {
						deferred.reject(status);
					}
				});

				return deferred.promise;
			}
		};
	} else {
		alert('API Google inaccessible');
	}
}])

.factory('openWeatherApi', [
	'$q',
	'$http',
function($q, $http) {
	var currentWeather = function(position) {
		var deferred = $q.defer(),
			url = 'http://api.openweathermap.org/data/2.5/weather';

		$http.get(url, { method: 'GET',
			params: {
				mode: 'json', lang: 'fr',
				units: 'metric', u: 'c',
				lat: position.coords.latitude,
				lon: position.coords.longitude
			}
		}).success(function(data, status) {
			deferred.resolve(data);
		}).error(function(data, status) {
			deferred.reject(status);
		});

		return deferred.promise;
	};

	return {
		getCurrentWeather: currentWeather
	};
}]);