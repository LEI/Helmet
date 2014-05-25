'use strict';

angular.module('helmetApp.services', [])

.factory('GeolocationService', [
	'$rootScope',
	'$q',
function ($rootScope, $q) {
	if (!navigator.geolocation) {
		alert('Géolocalisation non supportée');
	}

	return {
		getCurrentPosition: function (onSuccess, onError, options) {
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
			options || { timeout: 30000, enableHighAccuracy: true, maximumAge: 30000 });

			return deferred.promise;
		},
		watchPosition: function(onSuccess, onError, options) {
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
		},
		calculateDistance: function(lat1, lon1, lat2, lon2) {
			function toRad(n) {
				return n * Math.PI / 180;
			}
			// Reused code - copyright Moveable Type Scripts - retrieved May 4, 2010.
			// http://www.movable-type.co.uk/scripts/latlong.html
			// Under Creative Commons License http://creativecommons.org/licenses/by/3.0/
			var R = 6371; // km
			var dLat = toRad(lat2-lat1);
			var dLon = toRad(lon2-lon1);
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
				Math.sin(dLon/2) * Math.sin(dLon/2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			var d = R * c;
			return d;
		}
	};
}])

.factory('DirectionFactory', [
	'$rootScope',
	'$q',
	'$http',
function($rootScope, $q, $http) {
	if (typeof google !== 'undefined') {
		var directionsDisplay = new google.maps.DirectionsRenderer(),
		geocoder = new google.maps.Geocoder(),
		infowindow,
		knownDests = [],
		mapOptions = {
			zoom: 15,
			mapTypeId: 'roadmap',
			streetViewControl: false
		},
		posMarker,
		posCircle;
		return {
			initMap: function(position) {
				var origin = new google.maps.LatLng(
					position.coords.latitude,
					position.coords.longitude);
				// Cannot read property 'offsetWidth' of null
				$rootScope.map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
				$rootScope.map.setCenter(origin);
			},
			locateMe: function(position) {
				posMarker = new google.maps.Marker({
					clickable : false,
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 5,
					},
					/*icon : new google.maps.MarkerImage(
						'img/marker.png',
						new google.maps.Size(22, 22),
						new google.maps.Point(0, 18),
						new google.maps.Point(11, 11)),*/
					shadow : null,
					zIndex : 999,
					map : $rootScope.map
				});
				posCircle = new google.maps.Circle({
					fillColor : 'blue',
					fillOpacity : 0.10,
					strokeColor : 'blue',
					strokeOpacity : 0.25,
					strokeWeight : 1,
					map : $rootScope.map
				});

				var center = new google.maps.LatLng(
					position.coords.latitude,
					position.coords.longitude),
				accuracy = position.coords.accuracy;

				posMarker.setPosition(center);
				posCircle.setCenter(center);
				posCircle.setRadius(accuracy);

				$rootScope.map.setCenter(center);
				$rootScope.map.fitBounds(posCircle.getBounds());

				if (accuracy < 50) {
					console.log(accuracy);
				} else {
					alert('Précision > 50m');
				}
				/*popup = popup !== undefined ? popup : 'Hello You';
				infowindow = new google.maps.InfoWindow({
					content: popup
				});
				google.maps.event.addListener(marker, 'click', function () {
					return infowindow.open($rootScope.map, marker);
				});*/
			},
			fitStep: function(step) {
				var bounds = new google.maps.LatLngBounds();
				bounds.extend(step.start_point);
				bounds.extend(step.end_point);
				$rootScope.map.fitBounds(bounds);
			},
			getDirections: function(position, destination) {
				var origin, deferred = $q.defer(),
				directionsService = new google.maps.DirectionsService();
				// Recherche de la latitude et longitude
				if (knownDests[destination] === undefined) {
					this.geocode(destination).then(function(latLng) {
						knownDests[destination] = latLng;
						initDirection(latLng);
					}, function(response, status) {
						deferred.reject(status);
					});
				} else {
					initDirection(knownDests[destination]);
				}
				// Initialisation de la destination
				function initDirection(destLatLng) {
					if (position === undefined) {
						deferred.reject('Position inconnue');
						return false;
					}
					origin = new google.maps.LatLng(
						position.coords.latitude,
						position.coords.longitude);
					// Recherche de l'itinéraire
					directionsService.route({
						origin: origin,
						destination: destLatLng,
						travelMode: google.maps.DirectionsTravelMode.DRIVING,
						unitSystem : google.maps.UnitSystem.METRIC,
						region: 'FR',
						language: 'FR'
					}, function (response, status) {
						if (status === google.maps.DirectionsStatus.OK) {
							// Affichage de l'itinéraire
							directionsDisplay.setMap($rootScope.map);
							directionsDisplay.setDirections(response);
							// DirectionsRenderer Panel
							//directionsDisplay.setPanel(document.getElementById('directions-steps')); // || null
							deferred.resolve(response);
						} else {
							deferred.reject(status);
						}
					});
				}

				return deferred.promise;
			},
			geocode: function(address) {
				var deferred = $q.defer();
				geocoder.geocode({
					address: address
				}, function(response, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						deferred.resolve(response[0].geometry.location, status);
					} else {
						deferred.reject(response, status);
					}
				});

				return deferred.promise;
			}
		};
	} else {
		//alert('googleapis.com inaccessible');
	}
}])

.factory('openWeatherApi', [
	'$rootScope',
	'$q',
	'$http',
function($rootScope, $q, $http) {
	var currentWeather = function(position) {
		var deferred = $q.defer(),
			url = 'http://api.openweathermap.org/data/2.5/weather';
		if (position === undefined) {
			deferred.reject('Position inconnue');
			return deferred.promise;
		}
		$http.get(url, { method: 'GET',
			params: {
				mode: 'json', lang: 'fr',
				units: 'metric', u: 'c',
				lat: position.coords.latitude,
				lon: position.coords.longitude
			}
		}).success(function(response, status) {
			if (response.message === undefined) {
				deferred.resolve(response, status);
			} else {
				console.log(response);
				deferred.reject(response.cod + ' ' + response.message);
			}
		}).error(function(response, status) {
			deferred.reject(response, status);
		});

		return deferred.promise;
	};

	return {
		getCurrentWeather: currentWeather
	};
}]);