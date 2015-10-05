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
	name: {
		type: String,
		default: '',
		required: 'Please fill Organisation name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Organisation', OrganisationSchema);