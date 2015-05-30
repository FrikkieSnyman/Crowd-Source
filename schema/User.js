/**
 * Sample schema..
 * This will be relatively small at the beginning.
 */

exports = module.exports = function(app, mongoose) {
      var Schema = mongoose.Schema;
      var userSchema = new Schema({
      name : String,
      surname : String,
      });
      app.userSchema = userSchema;
};
