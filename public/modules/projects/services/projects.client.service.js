'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource', 'RESOURCE_DOMAIN',
	function($resource, RESOURCE_DOMAIN) {
		return $resource(RESOURCE_DOMAIN + '/projects/:projectId', {projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
