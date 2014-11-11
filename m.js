/* global _ */
/* jshint -W116 */

var M = (function (squatter) {
  //#Back office stuff
  //##Constants
  var localData = '~',
      callbackLists = '@',
      calcFunction = '^',
      watchTracking = '!';
  
  //##An initilizer
  function initialise(props, initFunk) {
    return _.reduce(props, function (m, d, i) {
      m[d] = initFunk(m, d, i);
      return m;
    }, {});
  }
  
  //#Manelbrot  
  function Mandelbrot(proto) {
    return {
      add: function (prop) {
        //For the property, add the key with a defailt
        function initAndSet (prop, key, initVal) {
          if(!proto[prop]) proto[prop] = {};
          proto[prop][key] = initVal;
        }
        
        //Add a place for the callback list
        initAndSet(callbackLists, prop, []);
        
        //Add a place for the calc funciton
        initAndSet(calcFunction, prop, null);
        
        //Create the gitter and setter that will use both
        Object.defineProperty(proto, prop, {
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
      },
      //getter
      get onSet() {
        return proto[callbackLists];
      },
      //getter
      get onGet() {
        return proto[calcFunction];
      }
    };
  }
  
  //#Meat and Potatoes
  //##The object that we will return for our library
  var lib = {};
  
  //##Deal with any squatters
  if (squatter) lib.squatter = squatter;
  
  //#The Mandelbrot, set.
  lib.create = function (obj) {
    //List all the properties on this object
    var props = _.keys(obj);
    
    //#Anonymous Object
    //Create the anonmous function that will be the constructor
    var anon = function (o) {
      this[localData] = o;
      this[watchTracking] = initialise(props, function() {
        return { cache: false }; 
      });
    };
    
    //Functional programming at it's best
    anon.M = Mandelbrot(anon.prototype);
    _.each(props, anon.M.add);
    
    return anon;
  };
  
  return lib;
})(M);