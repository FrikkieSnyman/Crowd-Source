var main = require('./main.js');


exports.testSomething = function(test){
    test.expect(1);
    var expected = 25;
    var result; 
    main.square(5,function(res){
      result = res;
    });
    console.log(result);
    test.equal(expected,result);
    test.done();
};
