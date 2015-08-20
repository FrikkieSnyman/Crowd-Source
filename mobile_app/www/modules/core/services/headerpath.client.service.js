'use strict';

angular.module('core').factory('Headerpath', [
	function() {
		// Headerpath service logic
		// ...
		var paths = {
			project: "",
			report: ""
		}

		// Public API
		return {
			setProjectPath: function(path) {
				paths.project = path;
			},
			setReportPath: function(path) {
				paths.report = path
			},
			getProjectPath: function() {
				return paths.project;
			},
			getReportPath: function() {
				return paths.report;
			}
		};
	}
]);