'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Organisation Schema
 */
var OrganisationSchema = new Schema({
	name: String,
	description : String,
	created: Date,
	user: Object,
	owner: String,
	members: [],
	projects: []
});

mongoose.model('Organisation', OrganisationSchema);