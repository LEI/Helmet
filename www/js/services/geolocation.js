'use strict';

angular.module('helmetApp')

.factory('$geolocation', [
	'$rootScope',
	'$q',
function ($rootScope, $q) {
	if (!'geolocation' in navigator) {
		alert('Géolocalisation non supportée');
	}
	var $$watchId;
	return {
		getCurrentPosition: function (options, onSuccess, onError) {
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
			options); //  || { timeout: 30000, enableHighAccuracy: true, maximumAge: 30000 }

			return deferred.promise;
		},
		watchPosition: function(options, onSuccess, onError) {
			var deferred = $q.defer();
			$$watchId = navigator.geolocation.watchPosition(
				function (position) {

					console.log(JSON.stringify(position, null, 4));

					deferred.notify(position);

					/*var that = this,
						args = arguments;
					if (onSuccess) {
						$rootScope.$apply(function () {
							onSuccess.apply(that, args);
						});
					}
					deferred.resolve(position);*/
				}, function (error) {
					/*var that = this,
						args = arguments;
					if (onError) {
						$rootScope.$apply(function () {
							onError.apply(that, args);
						});
					}*/
					deferred.reject(error.message ? error.message : error);
				},
			options); // || { frequency: 3000 }

			return deferred.promise;
		},
		clearWatch: function() {
			navigator.geolocation.clearWatch($$watchId);
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
}]);