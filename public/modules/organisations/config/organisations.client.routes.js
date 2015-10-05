'use strict';

//Setting up route
angular.module('organisations').config(['$stateProvider',
	function($stateProvider) {
		// Organisations state routing
		$stateProvider.
		state('listOrganisations', {
			url: '/organisations',
			templateUrl: 'modules/organisations/views/list-organisations.client.view.html'
		}).
		state('createOrganisation', {
			url: '/organisations/create',
			templateUrl: 'modules/organisations/views/create-organisation.client.view.html'
		}).
		state('viewOrganisation', {
			url: '/organisations/:organisationId',
			templateUrl: 'modules/organisations/views/view-organisation.client.view.html'
		}).
		state('editOrganisation', {
			url: '/organisations/:organisationId/edit',
			templateUrl: 'modules/organisations/views/edit-organisation.client.view.html'
		});
	}
]);