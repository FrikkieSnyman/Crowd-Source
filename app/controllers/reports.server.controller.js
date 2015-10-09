'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Report = mongoose.model('Report'),
	notification = require('./notification.server.controller'),
	Project = require('./projects.server.controller'),
	_ = require('lodash');

var string = '';
var visit = function(node, project) {
	var sumOfAverages = 0;
	var stddev = [];
	for (var i = 0; i < node.estimations.length; ++i) {
		sumOfAverages += (parseInt(node.minestimations[i]) + 4 * parseInt(node.estimations[i]) + parseInt(node.maxestimations[i]) ) / 6;
	}
	node.mean = (sumOfAverages / node.estimations.length).toFixed(2);

	var squareSum = 0;
	for (i = 0; i < node.estimations.length; ++i) {
		stddev[i] = (parseInt(node.maxestimations[i]) - parseInt(node.minestimations[i])) / 6;
		squareSum += stddev[i] * stddev[i];
	}
	node.stdDeviation = Math.sqrt(squareSum).toFixed(2);
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
	// From Unit tests if the tree is empty we should not be able to generate a report
	if(project.children)
	{
		var projectTree = project.children[0];
		traverseTree(projectTree, project);
		notification.sendReport(string, project, res);
	}
};
/**
 * Create a Report
 */
exports.create = function(req, res) { 
	delete req.body.$promise;
	delete req.body.$resolved;
	string = 'Visit ' + req.headers.host + '/#!/reports/' + req.body._id + ' to view report'; 
	var report = new Report(req.body);
	report.reopened = false;
	generateReport(req.body, res);
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
			Project.clearEstimated(report.project._id);
		}
	});
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
