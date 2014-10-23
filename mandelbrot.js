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
      m[d] = initFunk(m, d, i);
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
      this[watchTracking] = initialise(props, function() { return { cache: false }; });
    };
    
    //With the contructor created we build out the prototype... dynamicly
    
    anon.prototype[callbackLists] = initialise(props, function() { return []; });
    anon.prototype[calcFunction] = initialise(props, function() { return null; });
    
    //Then each of the existing props
    _.each(props, function (prop) {
      Object.defineProperty(anon.prototype, prop, {
        get: function() {
          var calcFunk = this[calcFunction][prop];
          
          //If no calculation funciton is defined then return the local data
          if(!_.isFunction(calcFunk)) return this[localData][prop];
          
          //else check if the last update is less than the last cached result time
          var watch = this[watchTracking][prop];
          if(watch.cache === false) {
            //Run the function to calculate the value then cache it locally
            this[localData][prop] = calcFunk.call(this, this[localData][prop]);
            watch.cache = true;
          }
          
          //Return the cached data
          return this[localData][prop];
        },
        set: function(nValue) {
          var self = this,
              oValue = self[localData][prop];
          self[localData][prop] = _.reduce(self[callbackLists][prop], function(lValue, callback) {
            return callback.call(self, nValue, oValue, lValue, prop);
          }, nValue);
          
          this[watchTracking][prop].cache = false;
        }
      });
    });
    return anon;
  }
  
  return Mandelbrot;
})(_);