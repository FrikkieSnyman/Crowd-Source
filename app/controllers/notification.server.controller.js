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
	// Project.findOne({_id: req.body.projectId}, function(err, project) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		var userName;
			
	// 		var funcDone = function(user, done) {
	// 			res.render('templates/invite-email', {
	// 				name: user.displayName,
	// 				//name: 'No_Name',
	// 				appName: config.app.title,
	// 				projectName: project.name,
	// 				url: 'http://' + req.headers.host + '/#!/projects/' + project._id + '/edit'
	// 			}, function(err, emailHTML) {
	// 				done(err, emailHTML, user);
	// 			});
	// 		};
			
	// 		var funcEmail = function(emailHTML, user, done) {
	// 			var smtpTransport = nodemailer.createTransport(config.mailer.options);
	// 			var mailOptions = {
	// 				to: user.email,
	// 				from: config.mailer.from,
	// 				subject: 'Estimation Invite',
	// 				html: emailHTML
	// 			};
	// 			smtpTransport.sendMail(mailOptions, function(err) {
	// 				if (!err) {
	// 					console.log('No Error.');
	// 				}

	// 				done(err, user);
	// 			});
	// 		};
			
	// 		var funcError = function(err) {
	// 			if (err) {
	// 				return next(err);
	// 			}
	// 		};
			
	// 		var funcPromise = function(err, user) {
	// 			if (!err) {
	// 				async.waterfall([
	// 					async.apply(funcDone,user),
	// 					// If valid email, send reset email using service
	// 					funcEmail
	// 				],funcError );
	// 			}
	// 		};

	// 		for (var i = project.users.length - 1; i >= 0; i--) {
	// 			userName = project.users[i];

	// 			User.findOne({username: userName}, funcPromise);
	// 		}
	// 	}
	// });
};
exports.sendReport = function(string, project, res) {
	// var owner = project.owner;
	// User.findOne({username : owner}, function(err, user) {
	// 	if (!err) {
	// 		async.waterfall([
	// 			function(done) {
	// 				res.render('templates/report-email', {
	// 					name: user.displayName,
	// 					appName: config.app.title,
	// 					projectName: project.name,
	// 					report: string
	// 				}, function(err, emailHTML) {
	// 					done(err, emailHTML, user);
	// 				});
	// 			},
	// 			function(emailHTML, user, done) {
	// 				var smtpTransport = nodemailer.createTransport(config.mailer.options);
	// 				var mailOptions = {
	// 					to: user.email,
	// 					from: config.mailer.from,
	// 					subject: 'Estimation report for ' + project.name,
	// 					html: emailHTML
	// 				};
	// 				smtpTransport.sendMail(mailOptions, function(err) {
	// 					if (!err) {
	// 						console.log('No error');
	// 					}
	// 					done(err);
	// 				});
	// 			}
	// 			], function(err) {
	// 				if (err) return err;
	// 			});
	// 	}
	// });
};

