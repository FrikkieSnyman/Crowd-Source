'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Organisation = mongoose.model('Organisation'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Organisation
 */
exports.create = function(req, res) {
	var organisation = new Organisation(req.body);
	organisation.user = req.user;

	organisation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organisation);

			User.find({username: {$in: organisation.members}}, function(err, users) {
				if(err) {
					console.log(err);
				} else {
					users.forEach(function(user) {
						user.organisations.push(organisation.name);
						user.save();
					}, this);
				}
			});

			// for (var i = organisation.members.length - 1; i >= 0; i--) {
			// 	organisation.members[i]
			// };
		}
	});
};

/**
 * Show the current Organisation
 */
exports.read = function(req, res) {
	res.jsonp(req.organisation);
};

/**
 * Update a Organisation
 */
exports.update = function(req, res) {
	var organisation = req.organisation ;

	organisation = _.extend(organisation , req.body);

	organisation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organisation);
		}
	});
};

/**
 * Delete an Organisation
 */
exports.delete = function(req, res) {
	var organisation = req.organisation ;

	organisation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organisation);
		}
	});
};

/**
 * List of Organisations
 */
exports.list = function(req, res) { 
	Organisation.find().sort('-created').populate('user', 'displayName').exec(function(err, organisations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organisations);
		}
	});
};

/**
 * Organisation middleware
 */
exports.organisationByID = function(req, res, next, id) { 
	Organisation.findById(id).populate('user', 'displayName').exec(function(err, organisation) {
		if (err) return next(err);
		if (! organisation) return next(new Error('Failed to load Organisation ' + id));
		req.organisation = organisation ;
		next();
	});
};

/**
 * Organisation authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.organisation.owner !== req.user.username) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
