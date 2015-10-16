'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	name : { type: String, required: true },
	description : String,
	children : [],
	deleted : Boolean,
	users : [],
	owner : String,
	user: Object,
	openForEstimation : Boolean,
	organisation: String,
	round : Number
});

mongoose.model('Project', ProjectSchema);