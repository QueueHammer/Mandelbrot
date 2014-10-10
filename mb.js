/*global _, setInterval, clearTimeout, clearInterval */
/*jshint -W116 */
console.clear();
String.prototype.log = function () {
  console.log(this.toString());
};


function Mandelbrot(obj) {
  var keys = _.keys(obj);
  var newObj = function (o) { this._ = o; };
  
  var local = '~',
      setCbk = '@',
      touch = '!',
      update = '^';
  
  //Setup local prop reference
  newObj.prototype[local] = _.object(keys, []);
  newObj.prototype[setCbk] = _.object(keys, _.map(keys, function () {return [];}));
  
  var getterAndSetters = _.map(keys, function (k) {
    return {
      get: function () {
        return this[local][k];
      },
      set: function (val) {
        var self = this;
        var old = self[local][k];
        this[local][k] = val;
        _.each(self[setCbk][k], function (c) {
          c(self[local][k], old);
        });
      }
    };
  });
  
  var props = _.object(keys, getterAndSetters);
  Object.defineProperties(newObj.prototype, props);
  
  return newObj;
}

var dataObj;
var data = _.chain(_.range(5))
.map(function () {
  return {
    one: _.random(10,100),
    two: _.random(0,5),
    three: _.random(1000, 9999)
  };
})
.tap(function (l) {
  dataObj =  Mandelbrot(l[0]);
})
.map(function (d) {
  return new dataObj(d);
})
.value();

var index = _.random(0,data.length - 1);
_.each([index, (index + 1) % data.length, index], function (i) {
  ('--Index' + i).log();
  var d = data[i];
  var newVal;
  'Show value'.log();
  console.log(d.one);
  
  newVal = _.random(100);
  ('Set value: ' + newVal).log();
  d.one = newVal;
  'Confirm value'.log();
  console.log(d.one);

  'Add Callback'.log();
  dataObj.prototype.$.one.push(function (n, o) {
    console.log('Update Callback');
    console.log(n, o);
  });
  
  newVal = _.random(100);
  ('Set value: ' + newVal).log();
  d.one = newVal;
  'Confirm value'.log();
  console.log(d.one);
});
