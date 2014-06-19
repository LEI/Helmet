'use strict';

angular.module('helmetApp')

.factory('$direction', [
	'$rootScope',
	'$q',
	'$http',
function($rootScope, $q, $http) {
	var center, bounds;
	if ('google' in window) {
		var geocoder = new google.maps.Geocoder(),
		directionsDisplay = new google.maps.DirectionsRenderer(),
		directionsService = new google.maps.DirectionsService();
	} else {
		console.log('API Google inaccessible');
	}
	return {
		map: null,
		verify: function() {
			if ( !('google' in window) || google === undefined ) {
				alert('API Google inaccessible');
			}
		},
		initMap: function(position, p_bounds) {
			this.verify();
			var self = this, deferred = $q.defer();
			angular.element(document).ready(function () {
				// Initialisation Google Map
				// Cannot read property 'offsetWidth' of null
				self.map = new google.maps.Map(document.getElementById('google-map'), {
					zoom: 15,
					mapTypeId: 'roadmap',
					streetViewControl: false
				});
				if (p_bounds !== undefined) {
					self.map.fitBounds(p_bounds);
					deferred.resolve();
				} else if (position !== undefined) {
					center = new google.maps.LatLng(
						position.coords.latitude,
						position.coords.longitude);
					self.map.setCenter(center);
					deferred.resolve();
				} else {
					deferred.reject();
				}
			});
			// Remise à zéro marqueur position
			/*if ($rootScope.positionMarker !== undefined) {
				$rootScope.positionMarker.marker.setMap(null);
				$rootScope.positionMarker.circle.setMap(null);
			}*/
			return deferred.promise;
		},
		resetMap: function() {
			directionsDisplay.setMap(null);
		},
		_getDirection: function(position, destination, ignore) {
			this.verify();
			var deferred = $q.defer();
			// Recherche de l'itinéraire
			directionsService.route({
				origin: new google.maps.LatLng(
					position.coords.latitude,
					position.coords.longitude),
				destination: new google.maps.LatLng(
					destination.coords.latitude,
					destination.coords.longitude),
				travelMode: google.maps.DirectionsTravelMode.DRIVING,
				unitSystem : google.maps.UnitSystem.METRIC,
				region: 'FR',
				language: 'FR'
			}, function (response, status) {

				if (status === google.maps.DirectionsStatus.OK) {

					if (!ignore) {
						$rootScope.$storage.destination = response;
					}

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

			return deferred.promise;
		},
		getDirection: function(position, destination) {
			var self = this, deferred = $q.defer();
			// Recherche de la latitude et longitude
			this.geocode(destination).then(function(destLatLng) {
				self._getDirection(position, {
					coords: {
						latitude: destLatLng.k,
						longitude: destLatLng.A
					}
				}).then(function(res){
					deferred.resolve(res);
				}, function(error) {
					deferred.reject(error);
				});
			}, function(response, status) {
				if (response.length === 0) {
					deferred.reject('Destination inconnue');
				} else {
					deferred.reject(status);
				}
			});

			return deferred.promise;
		},
		displayDirection: function(direction) {
			directionsDisplay.setMap(this.map);
			directionsDisplay.setDirections(direction);
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
		getInstruction: function(step) {
			this.verify();
			var instruction = step.current.instructions,
				tmp = document.createElement("div");
			tmp.innerHTML = instruction;

			return tmp.textContent || tmp.innerText;
		}
		/*,updatePositionMarker: function(position) {
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
		}*/
	};
}]);