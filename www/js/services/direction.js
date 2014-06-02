'use strict';

angular.module('helmetApp')

.factory('$direction', [
	'$rootScope',
	'$q',
	'$http',
function($rootScope, $q, $http) {
	if ('google' in window) {
		var center, bounds,
		directionsDisplay = new google.maps.DirectionsRenderer(),
		directionsService = new google.maps.DirectionsService(),
		geocoder = new google.maps.Geocoder();
		return {
			map: null,
			destination: {},
			initMap: function(position, p_bounds) {
				// Cannot read property 'offsetWidth' of null
				var self = this;
				angular.element(document).ready(function () {
					// Initialisation Google Map
					self.map = new google.maps.Map(document.getElementById('google-map'), {
						zoom: 15,
						mapTypeId: 'roadmap',
						streetViewControl: false
					});
					if (p_bounds === undefined) {
						center = new google.maps.LatLng(
							position.coords.latitude,
							position.coords.longitude);
						self.map.setCenter(center);
					} else {
						self.map.fitBounds(p_bounds);
					}
				});
				// Remise à zéro marqueur position
				if ($rootScope.positionMarker !== undefined) {
					$rootScope.positionMarker.marker.setMap(null);
					$rootScope.positionMarker.circle.setMap(null);
				}
			},
			getDirection: function(position, destination) {
				var self = this, deferred = $q.defer();
				//directionsService = new google.maps.DirectionsService();
				if (this.destination[destination] === undefined) {
					// Recherche de la latitude et longitude
					this.geocode(destination).then(function(latLng) {
						center = new google.maps.LatLng(
							position.coords.latitude,
							position.coords.longitude);
						// Recherche de l'itinéraire
						directionsService.route({
							origin: center,
							destination: latLng,
							travelMode: google.maps.DirectionsTravelMode.DRIVING,
							unitSystem : google.maps.UnitSystem.METRIC,
							region: 'FR',
							language: 'FR'
						}, function (response, status) {
							if (status === google.maps.DirectionsStatus.OK) {
								self.destination[destination] = [];
								self.destination[destination] = response;
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
						console.log(response, status);
						deferred.reject(status);
					});
				} else {
					deferred.resolve(this.destination[destination]);
				}

				return deferred.promise;
			},
			displayDirection: function(direction) {
				directionsDisplay.setMap(this.map);
				directionsDisplay.setDirections(direction);
				// DirectionsRenderer Panel
				//directionsDisplay.setPanel(document.getElementById('directions-steps')); // || null
			},
			fitStep: function(step) {
				bounds = new google.maps.LatLngBounds();
				bounds.extend(step.start_point);
				bounds.extend(step.end_point);
				this.map.fitBounds(bounds);
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
			updatePositionMarker: function(position) {
				// Initialisation marqueur et cercle
				if ($rootScope.positionMarker === undefined) {
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
						map : this.map
					});
					$rootScope.positionMarker.circle = new google.maps.Circle({
						fillColor : 'blue',
						fillOpacity : 0.10,
						strokeColor : 'blue',
						strokeOpacity : 0.25,
						strokeWeight : 1,
						map : this.map
					});
				}
				//$rootScope.positionMarker.marker.setMap(null);
				//$rootScope.positionMarker.circle.setMap(null);
				center = new google.maps.LatLng(
					position.coords.latitude,
					position.coords.longitude);
				$rootScope.positionMarker.marker.setPosition(center);
				$rootScope.positionMarker.circle.setCenter(center);
				$rootScope.accuracy = position.coords.accuracy;
				$rootScope.positionMarker.circle.setRadius($rootScope.accuracy);
				bounds = $rootScope.positionMarker.circle.getBounds();
				if (this.map === undefined) {
					this.initMap(position, bounds);
				} else {
					this.map.fitBounds(bounds);
				}
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