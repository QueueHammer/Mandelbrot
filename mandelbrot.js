/* global _ */
/* jshint -W116 */
console.clear();
String.prototype.log = function () {
  console.log(this.toString());
};

var Mandelbrot = (function(_){
  var localData = '~',
      callbackLists = '@',
      calcFunction = '^',
      watchTracking = '!';
  
  function initialise(props, initFunk) {
    return _.reduce(props, function (m, d, i) {
      m[i] = initFunk(m, d, i);
      return m;
    }, {});
  }
  
  function M (that, data) {
    
  }
  
  function Mandelbrot(obj) {
    //List all the properties on this object
    var props = _.keys(obj);
    
    //#Anonymous Object
    //Create the anonmous function that will be the constructor
    var anon = function (o) {
      this[localData] = o;
      this[callbackLists] = initialise(o, function() { return []; });
      this[calcFunction] = initialise(o, function() { return null; });
      this[watchTracking] = initialise(o, function() { return { update: 0, cache: 0 }; });
    };
    
    //With the contructor created we build out the prototype... dynamicly
    _.each(props, function (prop) {
      Object.defineProperty(anon.prototype, prop, {
        enumerable:false,
        get: function() {
          var calcFunk = this[calcFunction][prop];
          
          //If no calculation funciton is defined then return the local data
          if(!_.isFunction(calcFunk)) return this[localData][prop];
          
          //else check if the last update is less than the last cached result time
          var watch = this[watchTracking][prop];
          if(watch.update >= watch.cache) {
            //Run the function to calculate the value then cache it locally
            this[localData][prop] = this[calcFunction](this[localData][prop]);
          }
          
          //Return the cached data
          return this[localData][prop];
        },
        set: function(nValue) {
          var self = this,
              oValue = self[localData][prop];
          self[localData][prop] = _.reduce(self[callbackLists], function(lValue, callback) {
            return callback(nValue, oValue, lValue, prop, self);
          }, undefined);
        }
      });
    });
    return anon;
  }
  
  return Mandelbrot;
})(_);