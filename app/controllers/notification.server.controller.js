'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	User = mongoose.model('User'),
	Project = mongoose.model('Project'),
	async = require('async'),
	config = require('../../config/config'),
	nodemailer = require('nodemailer'),
	_ = require('lodash');

exports.sendInvites = function(req, res, next) {
	Project.findOne({_id: req.body.projectId}, function(err, project) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var userName;

			for (var i = project.users.length - 1; i >= 0; i--) {
				userName = project.users[i];

				User.findOne({username: userName}, function(err, user) {
					if (err) {} else {
						async.waterfall([
							function(done) {
								res.render('templates/invite-email', {
									name: user.displayName,
									appName: config.app.title,
									projectName: project.name,
									url: 'http://' + req.headers.host + '/#!/projects/' + project._id + '/edit'
								}, function(err, emailHTML) {
									done(err, emailHTML, user);
								});
							},
							// If valid email, send reset email using service
							function(emailHTML, user, done) {
								var smtpTransport = nodemailer.createTransport(config.mailer.options);
								var mailOptions = {
									to: user.email,
									from: config.mailer.from,
									subject: 'Estimation Invite',
									html: emailHTML
								};
								smtpTransport.sendMail(mailOptions, function(err) {
									if (!err) {
									}

									done(err);
								});
							}
						], function(err) {
							if (err) {
								return next(err);
							}
						});
					}
				});
			}
		}
	});
};
exports.sendReport = function(string, project, res) {
	var owner = project.owner;
	User.findOne({username : owner}, function(err, user) {
		if (err) {} else {
			async.waterfall([
				function(done) {
					res.render('templates/report-email', {
						name: user.displayName,
						appName: config.app.title,
						projectName: project.name,
						report: string
					}, function(err, emailHTML) {
						done(err, emailHTML, user);
					});
				},
				function(emailHTML, user, done) {
					var smtpTransport = nodemailer.createTransport(config.mailer.options);
					var mailOptions = {
						to: user.email,
						from: config.mailer.from,
						subject: 'Estimation report for ' + project.name,
						html: emailHTML
					};
					smtpTransport.sendMail(mailOptions, function(err) {
						if (!err) {
							//asd
						}
						done(err);
					});
				}
				], function(err) {
					if (err) return next(err);
				});
		}
	});
};

