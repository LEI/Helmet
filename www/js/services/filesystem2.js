'use strict';

angular.module('helmetApp')

/*
 *	File System API
 */

// http://www.html5rocks.com/en/tutorials/file/filesystem/
// https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md

.factory('FileSystem2', [
	'$q',
function($q) {
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	return {
		request: function(type, size) {
			var deferred = $q.defer();
			window.requestFileSystem(
				type || window.PERSISTENT,
				size || 5*1024*1024 /*5MB*/,
			function(response) {
				//console.log(response);
				deferred.resolve(response);
			}, function(error) {
				//console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		},
		getFile: function(file) {
			var deferred = $q.defer();
			console.log(file);
			file.root.getFile('routes.json', {
				create: true
			}, function(fileEntry) {
				deferred.resolve(fileEntry);
			}, function(error) {
				deferred.reject(error);
			});

			return deferred.promise;
		},
		loadFile: function(fileEntry) {
			var deferred = $q.defer();
			//console.log(fileEntry.fullPath);
			fileEntry.file( function(file) {
				var reader = new FileReader();
				reader.onloadend = function(e) {
					console.log(e);
					deferred.resolve(this.result);
				};
				reader.readAsText(file);
			}, function(error) {
				deferred.reject(error);
			});

			return deferred.promise;
		},
		read: function() {
			var self = this;
			window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
				self.request(PERSISTENT, grantedBytes).then( function(file) {
					self.getFile(file).then( function(fileEntry) {
						self.loadFile(fileEntry).then( function(response) {
							console.log(response);
						}, function(error) {
							console.log(error);
						});
					}, function(error) {
						console.log(error);
					});
				}, function(error) {
					console.log(error);
				});
			}, function(error) {
				console.log(error);
			});
		}
	};
}]);
