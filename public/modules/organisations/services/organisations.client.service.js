'use strict';

//Organisations service used to communicate Organisations REST endpoints
angular.module('organisations').factory('Organisations', ['$resource', 'RESOURCE_DOMAIN',
	function($resource, RESOURCE_DOMAIN) {
		return $resource(RESOURCE_DOMAIN + 'organisations/:organisationId', { organisationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
