exports.square = function (r,callback) {
  callback(r * r);
};

exports.subtract = function(a,b,callback){
	callback(a - b);
};

exports.addition = function(a,b,callback){
	callback(a + b);
};