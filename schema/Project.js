exports = module.exports = function(app, mongoose) {
	var Schema = mongoose.Schema;
	var projectSchema = new Schema({
		name : String,
		description : String,
		children : [],
		deleted : Boolean,
		users : []
	});
	app.projectSchema = projectSchema;
};
