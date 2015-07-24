'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Report = mongoose.model('Report'),
	notification = require('./notification.server.controller'),
	_ = require('lodash');

var string = '';
var visit = function(node, project) {
	// string = string + '<br />Estimations for ' + node.title;
	string = string + '\r\n\r\nEstimations for: ' + node.title;
	// string.push('Estimations for: ' + node.title);
	for (var i = 0; i < node.estimations.length; ++i) {
		// string = string + '<br />' + project.users[i] + ' ' + node.estimations[i];
		string = string + '\r\n\r\n' + project.users[i] + ': ' + node.estimations[i];
		// string.push(project.users[i] + ' ' + node.estimations[i]);
	}

};

var traverseTree = function(node, project) {
	if (node === null) {
		return;
	}
	visit(node, project);
	for (var i = 0; i < node.nodes.length; ++i) {
		traverseTree(node.nodes[i], project);
	}
};

var generateReport = function(project, res) {
	var projectTree = project.children[0];
	string = '';
	traverseTree(projectTree, project);
	notification.sendReport(string, project, res);
};
/**
 * Create a Report
 */
exports.create = function(req, res) {
	delete req.body.$promise;
	delete req.body.$resolved;

	var report = new Report(req.body);
	report.project = req.body;
	report.user = req.user;

	report.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(report);
		}
	});
	generateReport(req.body, res);
};

/**
 * Show the current Report
 */
exports.read = function(req, res) {
	res.jsonp(req.report);
};

/**
 * Update a Report
 */
exports.update = function(req, res) {
	var report = req.report ;

	report = _.extend(report , req.body);

	report.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(report);
		}
	});
};

/**
 * Delete an Report
 */
exports.delete = function(req, res) {
	var report = req.report ;

	report.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(report);
		}
	});
};

/**
 * List of Reports
 */
exports.list = function(req, res) { 
	Report.find().sort('-created').populate('user', 'displayName').exec(function(err, reports) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reports);
		}
	});
};

/**
 * Report middleware
 */
exports.reportByID = function(req, res, next, id) { 
	Report.findById(id).populate('user', 'displayName').exec(function(err, report) {
		if (err) return next(err);
		if (! report) return next(new Error('Failed to load Report ' + id));
		req.report = report ;
		next();
	});
};

/**
 * Report authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.report.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};