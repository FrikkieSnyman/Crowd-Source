

var names = ["Hanrich","Frikkie","Hugo","Andre","Isabel"];

exports = module.exports = function(app) {
	/*
	The app gives us dependancy injection! 
	 */

	this.addName = function(request, response) {
		console.log("Client is adding name " + request.body.name);
		names.push(request.body.name);
		response.send(true);
/*Some attempt a making a DB entry
			var mongoose = app.mongoose;
			var Schema = mongoose.Schema;
			var userSchema = new Schema({
			name : String,
			});

			var User = mongoose.model('User', userSchema);

			var arvind = new User({
			name : request.body.name,
			});
			 
			arvind.save(function (err, data) {
			if (err) console.log(err);
			else console.log('Saved : ', data );
			});
*/

	};

	this.getNames = function(request,response){
	//console.log("hello")
	console.log("Client asked me for information");
	response.send(names);
	}

	return this;
}

