'use strict';

//Setting up route
angular.module('sidenav').config(['$stateProvider',
	function($stateProvider) {
		// Sidenav state routing
		$stateProvider.
		state('dialog', {
			url: '/dialog',
			templateUrl: 'modules/sidenav/views/dialog.client.view.html'
		});
	}
]);