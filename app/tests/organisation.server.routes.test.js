'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organisation = mongoose.model('Organisation'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, organisation;

/**
 * Organisation routes tests
 */
describe('Organisation CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Organisation
		user.save(function() {
			organisation = {
				name: 'Organisation Name'
			};

			done();
		});
	});

	it('should be able to save Organisation instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organisation
				agent.post('/organisations')
					.send(organisation)
					.expect(200)
					.end(function(organisationSaveErr, organisationSaveRes) {
						// Handle Organisation save error
						if (organisationSaveErr) done(organisationSaveErr);

						// Get a list of Organisations
						agent.get('/organisations')
							.end(function(organisationsGetErr, organisationsGetRes) {
								// Handle Organisation save error
								if (organisationsGetErr) done(organisationsGetErr);

								// Get Organisations list
								var organisations = organisationsGetRes.body;

								// Set assertions
								//(organisations[0].user._id).should.equal(userId);
								(organisations[0].name).should.match('Organisation Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Organisation instance if not logged in', function(done) {
		agent.post('/organisations')
			.send(organisation)
			.expect(401)
			.end(function(organisationSaveErr, organisationSaveRes) {
				// Call the assertion callback
				done(organisationSaveErr);
			});
	});
	/*
	it('should not be able to save Organisation instance if no name is provided', function(done) {
		// Invalidate name field
		organisation.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organisation
				agent.post('/organisations')
					.send(organisation)
					.expect(400)
					.end(function(organisationSaveErr, organisationSaveRes) {
						// Set message assertion
						(organisationSaveRes.body.message).should.match('Please fill Organisation name');
						
						// Handle Organisation save error
						done(organisationSaveErr);
					});
			});
	});
	*/
	/*
	it('should be able to update Organisation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organisation
				agent.post('/organisations')
					.send(organisation)
					.expect(200)
					.end(function(organisationSaveErr, organisationSaveRes) {
						// Handle Organisation save error
						if (organisationSaveErr) done(organisationSaveErr);

						// Update Organisation name
						organisation.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Organisation
						agent.put('/organisations/' + organisationSaveRes.body._id)
							.send(organisation)
							.expect(200)
							.end(function(organisationUpdateErr, organisationUpdateRes) {
								// Handle Organisation update error
								if (organisationUpdateErr) done(organisationUpdateErr);

								// Set assertions
								(organisationUpdateRes.body._id).should.equal(organisationSaveRes.body._id);
								(organisationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});
	*/

	it('should be able to get a list of Organisations if not signed in', function(done) {
		// Create new Organisation model instance
		var organisationObj = new Organisation(organisation);

		// Save the Organisation
		organisationObj.save(function() {
			// Request Organisations
			request(app).get('/organisations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Organisation if not signed in', function(done) {
		// Create new Organisation model instance
		var organisationObj = new Organisation(organisation);

		// Save the Organisation
		organisationObj.save(function() {
			request(app).get('/organisations/' + organisationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', organisation.name);

					// Call the assertion callback
					done();
				});
		});
	});
	/*
	it('should be able to delete Organisation instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organisation
				agent.post('/organisations')
					.send(organisation)
					.expect(200)
					.end(function(organisationSaveErr, organisationSaveRes) {
						// Handle Organisation save error
						if (organisationSaveErr) done(organisationSaveErr);

						// Delete existing Organisation
						agent.delete('/organisations/' + organisationSaveRes.body._id)
							.send(organisation)
							.expect(200)
							.end(function(organisationDeleteErr, organisationDeleteRes) {
								// Handle Organisation error error
								if (organisationDeleteErr) done(organisationDeleteErr);

								// Set assertions
								(organisationDeleteRes.body._id).should.equal(organisationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});
	*/

	it('should not be able to delete Organisation instance if not signed in', function(done) {
		// Set Organisation user 
		organisation.user = user;

		// Create new Organisation model instance
		var organisationObj = new Organisation(organisation);

		// Save the Organisation
		organisationObj.save(function() {
			// Try deleting Organisation
			request(app).delete('/organisations/' + organisationObj._id)
			.expect(401)
			.end(function(organisationDeleteErr, organisationDeleteRes) {
				// Set message assertion
				(organisationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Organisation error error
				done(organisationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Organisation.remove().exec();
		done();
	});
});