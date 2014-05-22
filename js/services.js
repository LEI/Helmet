'use strict';

angular.module('helmetApp.services', [])

.factory('geolocation', [
	'$rootScope',
	'$q',
function ($rootScope, $q) {
	var currentPosition = function (onSuccess, onError, options) {
		if (options == undefined) {
			options = {
				timeout: 5000,
				enableHighAccuracy: true,
				maximumAge: 0
			};
		}
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
			deferred.reject(error);
		},
		options);

		return deferred.promise;
	},
	watchedPosition = function(onSuccess, onError, options) {
		if (options == undefined) {
			options = {
				frequency: 3000
			};
		}
		var deferred = $q.defer();
		navigator.geolocation.watchPosition(function (position) {
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
			deferred.reject(error);
		},
		options);

		return deferred.promise;
	};

	return {
		getCurrentPosition: currentPosition,
		watchPosition: watchedPosition
	};
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
			deferred.reject(data);
		});

		return deferred.promise;
	};

	return {
		getCurrentWeather: currentWeather
	};
}])

.factory('directionsApi', [
	'$q',
	'$http',
function($q, $http) {
	var direction = function(position, destination) {
		var deferred = $q.defer(),
			url = 'https://maps.google.fr/maps/api/directions/json',
			start = position.coords.latitude + ',' + position.coords.longitude;

		$http.get(url, { method: 'GET',
			params: {
				origin: start,
				destination: destination,
				sensor: true // ...
			}
		}).success(function(data, status) {
			deferred.resolve(data);
		}).error(function(data, status) {
			deferred.reject(data);
		});

		return deferred.promise;
	};

	return {
		getDirection: direction
	};
}])

.factory('googleApi', [
	'$rootScope',
	'$q',
	'$http',
function($rootScope, $q, $http) {
	var directionsDisplay = new google.maps.DirectionsRenderer(),
	marker, infowindow,
	mapOptions = {
		zoom: 15,//$scope.zoom !== undefined ? $scope.zoom : 15,
		mapTypeId: 'roadmap',
		streetViewControl: false
	};
	return {
		initMap: function() {
			var origin = {
				lat: $rootScope.position.coords.latitude,
				lng: $rootScope.position.coords.longitude
			};
			$rootScope.map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
			$rootScope.map.setCenter(origin);
			//this.addMarker(origin);
		},
		addMarker: function(location) {

			marker = new google.maps.Marker({
				map: $rootScope.map,
				position: location,
				animation: google.maps.Animation.DROP
			});
			infowindow = new google.maps.InfoWindow({
				content: 'lol'//$scope.markerContent !== undefined ? $scope.markerContent : 'Destination'
			});
			google.maps.event.addListener(marker, 'click', function () {
				return infowindow.open($rootScope.map, marker);
			});
		},
		getDirections: function() {
			var origin = $rootScope.position.coords.latitude + ' ' + $rootScope.position.coords.longitude;
			origin = origin !== undefined ? origin : 'Paris';

			var deferred = $q.defer(),
			directionsService = new google.maps.DirectionsService(),
			request = {
				origin: origin,
				destination: $rootScope.destination,
				travelMode: google.maps.DirectionsTravelMode.DRIVING,
				unitSystem : google.maps.UnitSystem.METRIC,
				region: 'FR'
			};

			directionsService.route(request, function (response, status) {
				if (status === google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
					deferred.resolve(response);
					//document.getElementById('wrongAddress').style.display = "none";
				} else {
					deferred.reject(response);
					//document.getElementById('wrongAddress').style.display = "block";
				}
			});

			directionsDisplay.setMap($rootScope.map);
			directionsDisplay.setPanel(document.getElementById('directionsList'));

			return deferred.promise;
		},
		clearDirections: function() {
			self.init();
			directionsDisplay.setPanel(null);
			$rootScope.origin = {
				lat: $rootScope.position.coords.latitude,
				lng: $rootScope.position.coords.longitude
			};
		},
		geocode: function(endPoint) {
			var deferred = $q.defer(),
				geocoder = new google.maps.Geocoder();

			geocoder.geocode({
				address: endPoint
			}, function(results, status) {
				var location = results[0].geometry.location;
				if (status === google.maps.GeocoderStatus.OK) {
					$rootScope.map.setCenter(location);
					this.addMarker(location);
				} else {
					alert('Cannot Geocode');
				}
			})
		}
	};
}])

.factory('bluetooth', [function() {
    var bluetoothSerial = cordova.require('bluetoothSerial');

    return {
        sendMessage: function(message) {
            // interact with bluetoothSerial
            alert("coucou");
        }
    };
}]);