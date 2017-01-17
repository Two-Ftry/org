var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;

var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
// add tests
suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
  // return arr.map(callback);
})
.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
  // var ret = [];
  // for(var i = 0; i < arr.length; i++){
  //   ret.push(callback(arr[i]));
  // }
  // return ret;
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });
