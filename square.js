exports.square = function (r,callback) {
  callback(r * r);
};

exports.subtract = function(a,b,callback){
	callback(a - b);
};

exports.addition = function(a,b,callback){
	callback(a + b);
};

exports.division = function(a,b,callback){
	// if(b !== 0){
		callback(a/b);
	// } else {
		// callback("zero division");
	// }
}