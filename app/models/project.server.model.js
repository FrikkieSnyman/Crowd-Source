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
	name : String,
	description : String,
	children : [],
	deleted : Boolean,
	users : [],
	owner : String,
	user: Object,
	openForEstimation : Boolean
});

mongoose.model('Project', ProjectSchema);