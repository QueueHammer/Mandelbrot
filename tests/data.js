/*global _, Mandelbrot */
/*jshint -W116 */
var data = (function (_) {
    var smallRandNumSet = function (count) {
      var dataObj;
      _.chain(_.range(count))
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
    };
  
  var customDataSet = function(count, propsAndValues) {
    return _.chain(_.range(count))
    .map(function () {
      return _.reduce(propsAndValues, function (m, d, i) {
        m[i] = _.sample(d);
        return m;ß
      }, {});
    })
    .value();
  };
  
  return {
    smallRandNumSet:smallRandNumSet,
    customDataSet:customDataSet
  };
})(_);