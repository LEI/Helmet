'use strict';

angular.module('appHelmet.directives', []).

directive('vhBluetooth', [function() {
	return {
		template: '<i class="fa fa-signal"></i> Bluetooth'
	};
}]);