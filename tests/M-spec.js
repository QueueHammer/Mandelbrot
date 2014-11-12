/*global _, M, data, jasmine, describe, it, expect */
/*jshint -W116 */

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
    var bookClass = M.create(book);
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
          expect(mBook[key]).toBe(newBook[key]);
        });
      });
    });
  });
  
  describe('The wrapper is a prototype for the warpped.', function () {
    var book = makeData(1)[0];
    var bookClass = M.create(book);
    var mBook = new bookClass(book);
    var newBook = makeData(1)[0];
    var otherBook = new bookClass(makeData(1)[0]);
    
    var keys = _.keys(book);
    var spyBook = _.object(keys, _.map(keys, function (key) {
      var spy = jasmine.createSpy(key + 'Spy');
      bookClass.M.onSet[key].push(spy);
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
        bookClass.M.onSet[key].push(spy);
        it(['When setting the prop ', key, ' on "otherBook"it\'s callback will be called.'].join(''), function () {
          otherBook[key] = newBook[key];
          expect(spyBook[key].calls.count()).toEqual(2);
        });
      });
    });
  });
  
  describe('Calculated values can also be setup', function () {
    var box = {
      width: 25,
      height: 15,
      area: 0
    };
    
    var boxObj = M.create(box);
    
    //Configure setter for width
    boxObj.M.onSet.width.push(function(nValue) {
      this.area = 0;
      return nValue;
    });
    
    //Configure setter for height
    boxObj.M.onSet.height.push(function(nValue) {
      this.area = 0;
      return nValue;
    });
    
    //Configure calculated function for area
    var spy = jasmine.createSpy('AreaSpy');
    boxObj.M.onGet.area = function() {
      spy();
      return this.width * this.height;
    };
    
    var mBox = new boxObj(box);
    
    
    it('So for area should equal width by height', function () {
      expect(mBox.area).toEqual(mBox.width * mBox.height);
      expect(spy.calls.count()).toEqual(1);
    });
    
    it('Changing the value of width will cause the area to change', function () {
      mBox.width = 50;
      expect(mBox.area).toEqual(mBox.width * mBox.height);
      expect(spy.calls.count()).toEqual(2);
    });
    
    it('Calling area multiple times returns a cached value', function () {
      expect(mBox.area).toEqual(mBox.width * mBox.height);
      expect(mBox.area).toEqual(mBox.width * mBox.height);
      expect(mBox.area).toEqual(mBox.width * mBox.height);
      expect(spy.calls.count()).toEqual(2);
    });
    
    it('Only when area is called after with and height have been set will it run', function () {
      mBox.width = 5;
      mBox.height = 10;
      expect(spy.calls.count()).toEqual(2);
      expect(mBox.area).toEqual(mBox.width * mBox.height);
      expect(spy.calls.count()).toEqual(3);
      
      mBox.width = 42;
      mBox.height = 9;
      mBox.width = 21;
      mBox.height = 78;
      mBox.width = 19;
      expect(mBox.area).toEqual(mBox.width * mBox.height);
      expect(spy.calls.count()).toEqual(4);
      expect(mBox.area).toEqual(mBox.width * mBox.height);
      expect(spy.calls.count()).toEqual(4);
    });
  });
});

/*
describe('For writing attributes', function () {
  it('', function () {});
});
*/