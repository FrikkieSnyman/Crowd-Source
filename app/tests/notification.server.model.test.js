'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Notification = require('../controllers/notification.server.controller.js');

/**
 * Globals
 */
var user, notification;

/**
 * Unit tests
 */
describe('Notification Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			done();
		});
	});

	describe('Method Save', function() {
		console.log('here');
	});

	afterEach(function(done) { 
		User.remove().exec();
		
		done();
	});
});