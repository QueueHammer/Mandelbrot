/*global _, Mandelbrot, data, jasmine, describe, it, expect */
/*jshint -W116 */

Object.defineProperty(String.prototype, 'i', {
  get: function () {
    return this.replace(/#\{(.*?)\}/g,function (whole, expr) {
        return eval(expr||'');
      });
  }
});
//var val = 7;
//console.log('the #{val}'.i);

function makeData(count) {
  return _.map(data.customDataSet(count, {
    cover: ['hard','soft'],
    author: ['Tom','Dick','Harry', 'Smith', 'Jones'],
    publisher: ['Broadridge','Penniesworth']
  }),function (d) {
    d.title = _.uniqueId('Book-');
    d.pages = _.random(100, 500);
    d.meta = {};
    return d;
  });
}

describe('Mandelbrot is a wrapper for objects.', function() {
  
  describe('When wrapped the object acts like normal.', function () {
    var book = makeData(1)[0];
    var bookClass = Mandelbrot(book);
    var mBook = new bookClass(book);
    describe('So when reading attributes:', function () {
      _.each(_.keys(book),function (key) {
        it(['the value of ', key, ' should be: ', book[key], '.'].join(''), function () {
          expect(mBook[key]).toBe(book[key]);
        });
      });
    });
    
    var newBook = makeData(1)[0];
    describe('For writing attributes', function () {
      _.each(_.keys(book),function (key) {
        it(['the value of ', key, ' should be: ', newBook[key], '.'].join(''), function () {
          mBook[key] = newBook[key];
          console.log(mBook[key], newBook[key]);
          expect(mBook[key]).toBe(newBook[key]);
        });
      });
    });
  });
  
  describe('The wrapper is a prototype for the warpped.', function () {
    var book = makeData(1)[0];
    var bookClass = Mandelbrot(book);
    var mBook = new bookClass(book);
    var newBook = makeData(1)[0];
    var otherBook = new bookClass(makeData(1)[0]);
    
    var keys = _.keys(book);
    var spyBook = _.object(keys, _.map(keys, function (key) {
      var spy = jasmine.createSpy(key + 'Spy');
      bookClass.prototype['@'][key].push(spy);
      return spy;
    }));
    
    describe('So callbacks can be chained to each property though the prototype:', function () {
      _.each(keys,function (key) {
        it(['When setting the prop ', key, ' on "book" it\'s callback will be called.'].join(''), function () {
          mBook[key] = newBook[key];
          expect(spyBook[key].calls.count()).toEqual(1);
        });
      });
    });
    describe('Because it\'s on the prototpye, calling another instace will call it again:', function () {
      _.each(keys,function (key) {
        var spy = jasmine.createSpy(key + 'Spy');
        bookClass.prototype['@'][key].push(spy);
        it(['When setting the prop ', key, ' on "otherBook"it\'s callback will be called.'].join(''), function () {
          otherBook[key] = newBook[key];
          expect(spyBook[key].calls.count()).toEqual(2);
        });
      });
    });
  });
});

/*
describe('For writing attributes', function () {
  it('', function () {});
});
*/