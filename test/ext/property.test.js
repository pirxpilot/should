import { describe, it } from 'node:test';
import { err } from '../util.js';
import '../../lib/index.js';

describe('property', () => {
  it('test property(name)', () => {
    'test'.should.have.property('length');
    (4).should.not.have.property('length');

    err(() => {
      'asd'.should.have.property('foo');
    }, "expected 'asd' to have property foo");
  });

  it('test property(name, val)', () => {
    'test'.should.have.property('length', 4);
    'asd'.should.have.property('constructor', String);

    err(() => {
      'asd'.should.have.property('length', 4);
    }, "expected 'asd' to have property length of 4 (got 3)");

    err(() => {
      'asd'.should.not.have.property('length', 3);
    }, "expected 'asd' not to have property length of 3 (false negative fail)");

    err(() => {
      const obj = { f: function f() {} };
      const f1 = function f1() {};
      f1.a = 1;
      obj.should.have.property('f', f1);
    }, "expected Object { f: Function { name: 'f' } } to have property f of Function { a: 1, name: 'f1' } (got Function { name: 'f' })");

    err(() => {
      ({ a: { b: 1 } }).should.have.property('a').and.have.property('b', 100);
    }, 'expected Object { b: 1 } to have property b of 100 (got 1)');

    err(() => {
      ({ a: { b: 1 } }).should.have.property('a').and.have.property('c', 100);
    }, 'expected Object { b: 1 } to have property c');

    err(() => {
      ({ a: { b: 1 } }).should.have.property('a').and.have.property('c');
    }, 'expected Object { b: 1 } to have property c');
  });

  it('test length(n)', () => {
    'test'.should.have.length(4);
    'test'.should.have.lengthOf(4);
    'test'.should.not.have.length(3);
    [1, 2, 3].should.have.length(3);
    ({ length: 10 }).should.have.length(10);

    err(() => {
      (4).should.have.length(3);
    }, 'expected 4 to have property length');

    err(() => {
      'asd'.should.not.have.length(3);
    }, "expected 'asd' not to have property length of 3 (false negative fail)");
  });

  it('test ownProperty(name)', () => {
    'test'.should.have.ownProperty('length');
    ({ length: 12 }).should.have.ownProperty('length');

    err(() => {
      ({ length: 12 }).should.not.have.ownProperty('length');
    }, 'expected Object { length: 12 } not to have own property length (false negative fail)');

    err(() => {
      ({ length: 12 }).should.not.have.ownProperty('length', 'foo');
    }, 'foo');

    err(() => {
      ({ length: 12 }).should.have.ownProperty('foo', 'foo');
    }, 'foo');
  });

  it('test ownProperty(name).equal(val)', () => {
    ({ length: 10 }).should.have.ownProperty('length').equal(10);
  });

  it('test properties(name1, name2, ...)', () => {
    'test'.should.have.properties('length', 'indexOf');
    (4).should.not.have.properties('length');

    err(() => {
      'asd'.should.have.properties('foo');
    }, "expected 'asd' to have property foo");

    err(() => {
      'asd'.should.not.have.properties('length', 'indexOf');
    }, "expected 'asd' not to have properties length, indexOf (false negative fail)");
  });

  it('test properties([names])', () => {
    'test'.should.have.properties(['length', 'indexOf']);
    (4).should.not.have.properties(['length']);

    err(() => {
      'asd'.should.have.properties(['foo']);
    }, "expected 'asd' to have property foo");
  });

  it('test any of properties', () => {
    'test'.should.have.any.of.properties('length', 'a', 'b');

    'test'.should.have.any.of.properties('length');

    ({ a: 10 }).should.have.any.of.properties('a', 'b');

    ({ a: 10 }).should.have.any.of.properties({ a: 10, b: 12 });

    ({ a: 10 }).should.not.have.any.of.properties('b', 'c');

    ({ a: 10 }).should.have.any.of.properties(['a', 'b']);

    err(() => {
      ({ a: 10 }).should.not.have.any.of.properties(['a', 'b']);
    }, 'expected Object { a: 10 } not to have property a (false negative fail)');

    err(() => {
      ({ a: 10, b: 10 }).should.not.have.any.of.properties(['a', 'b']);
    }, 'expected Object { a: 10, b: 10 } not to have any of properties a, b (false negative fail)');

    err(() => {
      ({ a: 10, b: 10 }).should.not.have.any.of.properties({ a: 10, b: 12 });
    }, 'expected Object { a: 10, b: 10 } not to have property a of 10 (false negative fail)');

    err(() => {
      ({ a: 10, b: 10 }).should.not.have.any.of.properties({ a: 10, b: 10 });
    }, 'expected Object { a: 10, b: 10 } not to have any of properties a of 10, b of 10 (false negative fail)');

    err(() => {
      ({ a: 11, b: 11 }).should.have.any.of.properties({ a: 10, b: 10 });
    }, 'expected Object { a: 11, b: 11 } to have any of properties a of 10 (got 11), b of 10 (got 11)');
  });

  it('test keys(array)', () => {
    if (typeof Map === 'function') {
      new Map([[1, 2]]).should.have.key(1);
    }

    ({ foo: 1 }).should.have.keys('foo');
    ({ foo: 1, bar: 2 }).should.have.keys('foo', 'bar');
    ({}).should.have.keys();

    ({ 1: 'cancelled', 3: 'deleted' }).should.have.keys(1, 3);

    ({ a: 10, b: 11 }).should.only.have.keys('a', 'b');

    ({ a: 10, b: 11, c: 999 }).should.not.only.have.keys('a', 'b');

    err(() => {
      ({ foo: 1 }).should.have.keys('bar');
    }, 'expected Object { foo: 1 } to have key bar\n\tmissing keys: bar');

    err(() => {
      ({ foo: 1 }).should.have.keys('bar', 'baz');
    }, 'expected Object { foo: 1 } to have keys bar, baz\n\tmissing keys: bar, baz');

    err(() => {
      ({ foo: 1 }).should.not.have.keys('foo');
    }, 'expected Object { foo: 1 } not to have key foo (false negative fail)');

    err(() => {
      ({ foo: 1 }).should.not.have.keys('foo');
    }, 'expected Object { foo: 1 } not to have key foo (false negative fail)');

    err(() => {
      ({ foo: 1, bar: 2 }).should.not.have.keys('foo', 'bar');
    }, 'expected Object { foo: 1, bar: 2 } not to have keys foo, bar (false negative fail)');
  });

  it('test empty', () => {
    ''.should.be.empty();
    [].should.be.empty();
    ({}).should.be.empty();
    ({ length: 10 }).should.not.be.empty();

    if (typeof Map === 'function') {
      new Map([[1, 2]]).should.not.be.empty();
    }

    ((...args) => {
      args.should.be.empty();
    })();

    err(() => {
      ({}).should.not.be.empty();
    }, 'expected Object {} not to be empty (false negative fail)');

    err(() => {
      ({ length: 10 }).should.be.empty();
    }, 'expected Object { length: 10 } to be empty');

    err(() => {
      'asd'.should.be.empty();
    }, "expected 'asd' to be empty");

    err(() => {
      ''.should.not.be.empty();
    }, "expected '' not to be empty (false negative fail)");
  });

  it('should .propertyByPath lookup properties by name path', () => {
    ({ a: { b: 10 } }).should.have.propertyByPath('a', 'b');

    ({ 0: { 0: 10 } }).should.not.have.propertyByPath(0, 0, 1);

    ({ a: { b: 10 } }).should.have.propertyByPath('a');

    ({ a: { b: 10 } }).should.not.have.propertyByPath('z');

    // true fail
    err(() => {
      ({ a: { b: 10 } }).should.have.propertyByPath('a', 'b', 'c');
    }, 'expected Object { a: Object { b: 10 } } to have property by path a, b, c - failed on c\n    expected 10 to have property c');

    // true fail
    err(() => {
      ({ a: { b: 10 } }).should.have.propertyByPath('z');
    }, 'expected Object { a: Object { b: 10 } } to have property by path z - failed on z\n    expected Object { a: Object { b: 10 } } to have property z');

    // false positive
    err(() => {
      ({ a: { b: 10 } }).should.not.have.propertyByPath('a', 'b');
    }, 'expected Object { a: Object { b: 10 } } not to have property by path a, b (false negative fail)');

    // false positive
    err(() => {
      ({ a: { b: 10 } }).should.not.have.propertyByPath('a');
    }, 'expected Object { a: Object { b: 10 } } not to have property by path a (false negative fail)');
  });
});
