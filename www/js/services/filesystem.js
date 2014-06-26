'use strict';

angular.module('helmetApp')

/*
 *	File System API
 */

// http://www.html5rocks.com/en/tutorials/file/filesystem/
// https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md

.factory('FileSystem', [
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
				deferred.resolve(response);
			}, function(error) {
				deferred.reject(error);
			});

			return deferred.promise;
		},
		getDirectory: function(file) {
			file.root.getDirectory("helmet", {create:true}, function(dirEntry) {
		    	//console.log("helmet crée");
		    }, function(error) {
		    	//console.log('Error with #getDirectory method.',error);
		    });
		},
		getFile: function(file) {
			var deferred = $q.defer();
			file.root.getFile('helmet/routes.json', {
				create: true,
				exclusive: false
			}, function(fileEntry) {
				deferred.resolve(fileEntry);
			}, function(error) {
				deferred.reject('Error with #getFile method.',error);
			});

			return deferred.promise;
		},
		writeFile: function(fileEntry, content) {
			var deferred = $q.defer();
			fileEntry.createWriter(function(fileWriter) {
	        	fileWriter.onwriteend = function(e) {
	            	deferred.resolve('Write completed.');
	          	};
	          	fileWriter.onerror = function(e) {
	            	deferred.reject('Write failed: ', e.toString());
	          	};
	          	var blob = new Blob([content], {type: 'text/plain'});
	          	fileWriter.write(blob);
	        },
	        function(error) {
	        	deferred.reject('Error with #createWriter method.',error);
	        });

	        return deferred.promise;
		},
		loadFile: function(fileEntry) {
			var deferred = $q.defer();
			fileEntry.file( function(file) {
				var reader = new FileReader();
				reader.onloadend = function(e) {
					var txtArea = document.createElement('textarea');
		            txtArea.value = this.result;
		            document.body.appendChild(txtArea);
					deferred.resolve(this.result);
				};
				reader.readAsText(file);
			}, function(error) {
				deferred.reject(error);
			});

			return deferred.promise;
		},
		init: function() {
			var deferred = $q.defer(),
				self = this;
			window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
				self.request(PERSISTENT, grantedBytes).then( function(file) {
					self.getDirectory(file);
					self.getFile(file).then( function(fileEntry) {
						self.loadFile(fileEntry).then( function(response) {
							if(response=="") {
								self.writeFile(fileEntry, JSON.stringify({data:[]})).then(function(response) {
									deferred.resolve(response);
								}, function(error) {
									deferred.reject(error);
								});
							} else {
								deferred.resolve("fichier existant");
							}
						}, function(error) {
							deferred.reject(error);
						});

					}, function(error) {
						deferred.reject(error);
					});
				}, function(error) {
					deferred.reject(error);
				});
			}, function(error) {
				deferred.reject(error);
			});

			return deferred.promise;
		},
		rewrite: function(content) {
			var deferred = $q.defer(),
				self = this;
			window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
				self.request(PERSISTENT, grantedBytes).then( function(file) {
					self.getDirectory(file);
					self.getFile(file).then( function(fileEntry) {
						self.writeFile(fileEntry, content).then(function(response) {
							deferred.resolve(response);
						}, function(error) {
							deferred.reject(error);
						});
					}, function(error) {
						deferred.reject(error);
					});
				}, function(error) {
					deferred.reject(error);
				});
			}, function(error) {
				deferred.reject(error);
			});

			return deferred.promise;
		},
		write: function(content, reset) {
			var deferred = $q.defer(),
				self = this;
			window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
				self.request(PERSISTENT, grantedBytes).then( function(file) {
					self.getDirectory(file);
					self.getFile(file).then( function(fileEntry) {
						self.loadFile(fileEntry).then( function(response) {
							if(reset!==true){
								var a = JSON.parse(response);
								a.data[a.data.length]=content;
								content = a;
								self.writeFile(fileEntry, JSON.stringify(content)).then(function(fileContent) {
									self.loadFile(fileEntry).then( function(response) {
										deferred.resolve(response);
									}, function(error) {
										deferred.reject(error);
									});
								}, function(error) {
								 	deferred.reject(error);
								});
							} else {
								content = {data:[]};
								fileEntry.remove(function() {
							      //console.log('File removed.');
							    }, function(error) {
							    	deferred.reject(error);
							    });
							    self.getFile(file).then( function(fileEntry) {
							    	self.writeFile(fileEntry, JSON.stringify(content)).then(function(fileContent) {
										self.loadFile(fileEntry).then( function(response) {
											deferred.resolve(response);
										}, function(error) {
											deferred.reject(error);
										});
									}, function(error) {
									 	deferred.reject(error);
									});
							    }, function(error) {
							    	deferred.reject(error);
							    });
							}

						}, function(error) {
							deferred.reject(error);
						});

					}, function(error) {
						deferred.reject(error);
					});
				}, function(error) {
					deferred.reject(error);
				});
			}, function(error) {
				deferred.reject(error);
			});

			return deferred.promise;
		},
		read: function() {
			var deferred = $q.defer(),
				self = this;
			window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
				self.request(PERSISTENT, grantedBytes).then( function(file) {
					self.getFile(file).then( function(fileEntry) {
						self.loadFile(fileEntry).then( function(response) {

							deferred.resolve( JSON.parse(response) );
						}, function(error) {
							deferred.reject(error);
						});
					}, function(error) {
						deferred.reject(error);
					});
				}, function(error) {
					deferred.reject(error);
				});
			}, function(error) {
				deferred.reject(error);
			});

			return deferred.promise;
		}
	};
}]);
