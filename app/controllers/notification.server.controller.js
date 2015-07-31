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

exports.sendInvites = function(req, res, next) {
	// Project.findOne({_id: req.body.projectId}, function(err, project) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		var userName;

	// 		for (var i = project.users.length - 1; i >= 0; i--) {
	// 			userName = project.users[i];

	// 			User.findOne({username: userName}, function(err, user) {
	// 				if (err) {} else {
	// 					async.waterfall([
	// 						function(done) {
	// 							res.render('templates/invite-email', {
	// 								name: user.displayName,
	// 								appName: config.app.title,
	// 								projectName: project.name,
	// 								url: 'http://' + req.headers.host + '/#!/projects/' + project._id + '/edit'
	// 							}, function(err, emailHTML) {
	// 								done(err, emailHTML, user);
	// 							});
	// 						},
	// 						// If valid email, send reset email using service
	// 						function(emailHTML, user, done) {
	// 							var smtpTransport = nodemailer.createTransport(config.mailer.options);
	// 							var mailOptions = {
	// 								to: user.email,
	// 								from: config.mailer.from,
	// 								subject: 'Estimation Invite',
	// 								html: emailHTML
	// 							};
	// 							smtpTransport.sendMail(mailOptions, function(err) {
	// 								if (!err) {
	// 									// res.send({
	// 									// 	message: 'An email has been sent to ' + user.email + ' with further instructions.'
	// 									// });
	// 								}

	// 								done(err);
	// 							});
	// 						}
	// 					], function(err) {
	// 						if (err) return next(err);
	// 					});
	// 				}
	// 			});
	// 		};

	// 		// res.jsonp(projects);
	// 	}
	// });

	// var user;

	// for (var i = req.body.length - 1; i >= 0; i--) {
	// 	user = req.body[i];

	// 	async.waterfall([	
	// 		function(token, user, done) {
	// 			res.render('templates/reset-password-email', {
	// 				name: user.displayName,
	// 				appName: config.app.title,
	// 				projectName: req.
	// 				url: 'http://' + req.headers.host + '/auth/reset/' + token
	// 			}, function(err, emailHTML) {
	// 				done(err, emailHTML, user);
	// 			});
	// 		},
	// 		// If valid email, send reset email using service
	// 		function(emailHTML, user, done) {
	// 			var smtpTransport = nodemailer.createTransport(config.mailer.options);
	// 			var mailOptions = {
	// 				to: user.email,
	// 				from: config.mailer.from,
	// 				subject: 'Password Reset',
	// 				html: emailHTML
	// 			};
	// 			smtpTransport.sendMail(mailOptions, function(err) {
	// 				if (!err) {
	// 					res.send({
	// 						message: 'An email has been sent to ' + user.email + ' with further instructions.'
	// 					});
	// 				}

	// 				done(err);
	// 			});
	// 		}
	// 	], function(err) {
	// 		if (err) return next(err);
	// 	});
	// };

	// async.waterfall([
	// 	// Generate random token
	// 	function(done) {
	// 		crypto.randomBytes(20, function(err, buffer) {
	// 			var token = buffer.toString('hex');
	// 			done(err, token);
	// 		});
	// 	},
	// 	// Lookup user by username
	// 	function(token, done) {
	// 		if (req.body.username) {
	// 			User.findOne({
	// 				username: req.body.username
	// 			}, '-salt -password', function(err, user) {
	// 				if (!user) {
	// 					return res.status(400).send({
	// 						message: 'No account with that username has been found'
	// 					});
	// 				} else if (user.provider !== 'local') {
	// 					return res.status(400).send({
	// 						message: 'It seems like you signed up using your ' + user.provider + ' account'
	// 					});
	// 				} else {
	// 					user.resetPasswordToken = token;
	// 					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	// 					user.save(function(err) {
	// 						done(err, token, user);
	// 					});
	// 				}
	// 			});
	// 		} else {
	// 			return res.status(400).send({
	// 				message: 'Username field must not be blank'
	// 			});
	// 		}
	// 	},
	// 	function(token, user, done) {
	// 		res.render('templates/reset-password-email', {
	// 			name: user.displayName,
	// 			appName: config.app.title,
	// 			url: 'http://' + req.headers.host + '/auth/reset/' + token
	// 		}, function(err, emailHTML) {
	// 			done(err, emailHTML, user);
	// 		});
	// 	},
	// 	// If valid email, send reset email using service
	// 	function(emailHTML, user, done) {
	// 		var smtpTransport = nodemailer.createTransport(config.mailer.options);
	// 		var mailOptions = {
	// 			to: user.email,
	// 			from: config.mailer.from,
	// 			subject: 'Password Reset',
	// 			html: emailHTML
	// 		};
	// 		smtpTransport.sendMail(mailOptions, function(err) {
	// 			if (!err) {
	// 				res.send({
	// 					message: 'An email has been sent to ' + user.email + ' with further instructions.'
	// 				});
	// 			}

	// 			done(err);
	// 		});
	// 	}
	// ], function(err) {
	// 	if (err) return next(err);
	// });
}

/**
 * Create a Notification
 */
exports.create = function(req, res) {

};

/**
 * Show the current Notification
 */
exports.read = function(req, res) {

};

/**
 * Update a Notification
 */
exports.update = function(req, res) {

};

/**
 * Delete an Notification
 */
exports.delete = function(req, res) {

};

/**
 * List of Notifications
 */
exports.list = function(req, res) {

};