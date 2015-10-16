'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organisation = mongoose.model('Organisation');

/**
 * Globals
 */
var user, organisation;

/**
 * Unit tests
 */
describe('Organisation Model Unit Tests:', function() {
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
			organisation = new Organisation({
				name: 'Organisation Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return organisation.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		/*
		it('should be able to show an error when try to save without name', function(done) { 
			organisation.name = '';

			return organisation.save(function(err) {
				should.exist(err);
				done();
			});
		});
		*/
	});

	afterEach(function(done) { 
		Organisation.remove().exec();
		User.remove().exec();

		done();
	});
});