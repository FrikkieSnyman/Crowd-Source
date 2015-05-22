var main = require('./square.js');


exports.testSquare = function(test){
    test.expect(1);
    var expected = 25;
    var result; 
    main.square(5,function(res){
      result = res;
      test.equal(expected,result);
      test.done();
    });
    
};

exports.testSubtract = function(test){
  test.expect(1);

  var expected = 2;
  var result;
  main.subtract(4,2,function(res){
    result = res;
    test.equal(expected,result);
    test.done();
  });
  
}

exports.testAdd = function(test){
  test.expect(1);

  var expected = 6;
  var result;
  main.addition(4,2,function(res){
    result = res;
    test.equal(expected,result);
    test.done();
  });
  
}

exports.testDiv = function(test){
  test.expect(2);
  var expected = 4;
  var result;
  main.division(8,2,function(res){
    result = res;
    test.equal(expected,result);
  });

  

  var expected = "zero division";
  main.division(8,0,function(res){
    result = res;
    test.equal(expected,result);
    test.done();
  });

  
}