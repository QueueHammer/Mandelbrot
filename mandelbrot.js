/*global _, setInterval, clearTimeout, clearInterval */
/*jshint -W116 */
console.clear();
String.prototype.log = function () {
  console.log(this.toString());
};


function Mandelbrot(obj) {
  
  var local = '~',
      setCbk = '@',
      touch = '!',
      update = '^';
  
  var keys = _.keys(obj);
  var newObj = function (o) { this[local] = o; };
  
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
        _.reduce(self[setCbk][k], function (lastResult, callback) {
          return callback(self[local][k], old, lastResult, k);
        }, old);
      }
    };
  });
  
  var props = _.object(keys, getterAndSetters);
  Object.defineProperties(newObj.prototype, props);
  
  return newObj;
}