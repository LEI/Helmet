'use strict';

angular.module('helmetApp')

.factory('$direction', [
	'$rootScope',
	'$q',
	'$http',
function($rootScope, $q, $http) {
	if ('google' in window) {
		var geocoder = new google.maps.Geocoder(),
		infowindow,
		_destinations = {},
		mapOptions = {
			zoom: 15,
			mapTypeId: 'roadmap',
			streetViewControl: false
		};
		return {
			initMap: function(position) {
				// Cannot read property 'offsetWidth' of null
				angular.element(document).ready(function () {
					$rootScope.map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
					var origin = new google.maps.LatLng(
						position.coords.latitude,
						position.coords.longitude);
					$rootScope.map.setCenter(origin);
				});
			},
			locateMe: function(position) {
				if ($rootScope.positionMarker !== undefined) {
					$rootScope.positionMarker.marker.setMap(null);
					$rootScope.positionMarker.circle.setMap(null);
				}
				$rootScope.positionMarker = {};
				$rootScope.positionMarker.marker = new google.maps.Marker({
					clickable : false,
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 5,
						fillColor : 'blue',
						fillOpacity : 1,
						strokeWeight : 0,
					},
					shadow : null,
					zIndex : 999,
					map : $rootScope.map
				});
				$rootScope.positionMarker.circle = new google.maps.Circle({
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

				$rootScope.positionMarker.marker.setPosition(center);
				$rootScope.positionMarker.circle.setCenter(center);
				$rootScope.positionMarker.circle.setRadius(accuracy);

				if ($rootScope.map === undefined) {
					this.initMap(position);
				}
				$rootScope.map.fitBounds($rootScope.positionMarker.circle.getBounds());

				if (accuracy > 50) {
					alert('Précision ~ ' + accuracy);
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
				var deferred = $q.defer();
				directionsService = new google.maps.DirectionsService();
				if (_destinations[destination] === undefined) {
					var directionsService = new google.maps.DirectionsService();
					// Recherche de la latitude et longitude
					this.geocode(destination).then(function(latLng) {
						var origin = new google.maps.LatLng(
							position.coords.latitude,
							position.coords.longitude);
						// Recherche de l'itinéraire
						directionsService.route({
							origin: origin,
							destination: latLng,
							travelMode: google.maps.DirectionsTravelMode.DRIVING,
							unitSystem : google.maps.UnitSystem.METRIC,
							region: 'FR',
							language: 'FR'
						}, function (response, status) {
							if (status === google.maps.DirectionsStatus.OK) {
								_destinations[destination] = [];
								_destinations[destination] = response;
								deferred.resolve(response);
							} else {
								switch(status) {
									case 'ZERO_RESULTS':
										status = 'Aucun résultat';
										break;
									case 'UNKNOWN_ERROR':
										status = 'Erreur inconnue';
										break;
								}
								deferred.reject(status);
							}
						});
					}, function(response, status) {
						console.log(response);
						deferred.reject(status);
					});
				} else {
					deferred.resolve(_destinations[destination]);
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
			},
			getInstruction: function(step) {
				var instruction = step.current.instructions,
					tmp = document.createElement("div");
				tmp.innerHTML = instruction;
				return tmp.textContent || tmp.innerText;
			}
		};
	} else {
		alert('API Google inaccessible');
	}
}]);