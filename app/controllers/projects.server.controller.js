'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Project = mongoose.model('Project'),
	Organisation = mongoose.model('Organisation'),
	_ = require('lodash');

var owner = function(project, req) {
	var user = req.user;
	if (user.username === project.owner) {
		return true;
	} else {
		return false;
	}
};

var estimator = function(project, req) {
	var user = req.user.username;
	for (var i = 0; i < project.users.length; ++i) {
		if (user === project.users[i]) {
			return true;
		}
	}
	return false;
};

var openForEstimation = function(project) {
	return project.openForEstimation;
};
/**
 * Create a Project
 */
exports.create = function(req, res) {
	var project = new Project(req.body);
	project.user = req.user;

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);

			if (project.organisation) {
				Organisation.findOne({name: project.organisation}, function(err, organisation) {
					if (err) {
						console.log(err);
					} else {
						organisation.projects.push(project.name);
						organisation.save();
					}
				});
			}
		}
	});
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
	res.jsonp(req.project);
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
	var project = req.project ;
	var socketio = req.app.get('socketio');
	project = _.extend(project , req.body);

	project.save(function(err, proj) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			socketio.sockets.emit('project.updated', proj);
			res.jsonp(project);
		}
	});
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
	var project = req.project;
	project.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);

			if (project.organisation) {
				Organisation.findOne({name: project.organisation}, function(err, organisation) {
					if (err) {
						console.log(err);
					} else {
						organisation.projects.splice(organisation.projects.indexOf(project.name), 1);
						organisation.save();
					}
				});
			}
		}
	});
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
	Project.find().sort('name').populate('user', 'displayName').exec(function(err, projects) {
		for (var i = projects.length - 1; i >= 0; --i) {
			var tmpProject = projects[i];
			if (!((owner(tmpProject, req)) || ((estimator(tmpProject, req)) && (openForEstimation(tmpProject))))) {
				projects.splice(i, 1);
			}
		}
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projects);
		}
	});
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) { 
	Project.findById(id).populate('user', 'displayName').exec(function(err, project) {
		if (err) return next(err);
		if (!project) return next(new Error('Failed to load Project ' + id));
		req.project = project ;
		next();
	});
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	
	if (req.project.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.getProject = function(req, res) {
	var projectId = req.body.projectId;

	Project.find({_id: projectId}, function(err, project) {
		if (err) {
			return console.error(err);
		}
		res.send(project);
	});
};
