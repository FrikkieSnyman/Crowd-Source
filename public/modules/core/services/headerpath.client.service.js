'use strict';

angular.module('core').factory('Headerpath', [
	function() {
		// Headerpath service logic
		// ...
		var paths = {
			project: '',
			report: '',
			organisation: ''
		};

		// Public API
		return {
			setProjectPath: function(path) {
				paths.project = path;
			},
			setReportPath: function(path) {
				paths.report = path;
			},
			setOrganisationPath: function(path) {
				paths.organisation = path;
			},
			getProjectPath: function() {
				return paths.project;
			},
			getReportPath: function() {
				return paths.report;
			},
			getOrganisationPath: function() {
				return paths.organisation;
			}
		};
	}
]);