exports = module.exports = function(app, mongoose) {
	var Schema = mongoose.Schema;
	var estimationSchema = new Schema({
		project : Object,
		user : [], // id to user
		dateOfEstimation : Date,
	});
	app.estimationSchema = estimationSchema;
};
