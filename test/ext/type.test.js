import { AssertionError } from 'node:assert';
import { describe, it } from 'node:test';
import util from 'node:util';
import should from '../../lib/index.js';
import { err } from '../util.js';

function _arguments() {
  return arguments;
}

describe('type', () => {
  it('test arguments', () => {
    const args = _arguments(1, 2, 3);
    args.should.be.arguments();
    [].should.not.be.arguments();

    err(() => {
      _arguments(1, 2, 3).should.not.be.arguments();
    }, 'expected Arguments [ 1, 2, 3 ] not to be arguments (false negative fail)');

    err(
      () => {
        ({}).should.be.arguments();
      },
      'expected Object {} to be arguments',
      '    expected Object {} to have [[Class]] Arguments'
    );
  });

  it('test typeof', () => {
    'test'.should.have.type('string');

    err(() => {
      'test'.should.not.have.type('string');
    }, "expected 'test' not to have type string (false negative fail)");

    err(() => {
      'test'.should.not.have.type('string', 'foo');
    }, 'foo');

    err(() => {
      (10).should.have.type('string');
    }, "expected 10 to have type string\n    expected 'number' to be 'string'");

    (5).should.have.type('number');

    err(() => {
      (5).should.not.have.type('number');
    }, 'expected 5 not to have type number (false negative fail)');

    err(() => {
      (5).should.not.have.type('number', 'foo');
    }, 'foo');
  });

  it('test instanceof', () => {
    function Foo() {}
    new Foo().should.be.an.instanceof(Foo);

    new Date().should.be.an.instanceof(Date);

    const tobi = { name: 'Tobi', age: 2 };
    tobi.should.be.an.instanceof(Object);

    const getSomething = () => 'something';
    getSomething.should.be.an.instanceof(Function);

    const number = Object(5);
    (number instanceof Number).should.be.true();
    number.should.be.an.instanceof(Number);

    const boolean = Object(true);
    (boolean instanceof Boolean).should.be.true();
    boolean.should.be.an.instanceof(Boolean);

    const string = Object('string');
    (string instanceof String).should.be.true();
    string.should.be.an.instanceof(String);

    err(() => {
      (3).should.an.instanceof(Foo);
    }, 'expected 3 to be an instance of Foo');

    err(() => {
      (3).should.an.instanceof(Foo, 'foo');
    }, 'foo');

    err(() => {
      ({}).should.not.be.an.instanceof(Object);
    }, 'expected Object {} not to be an instance of Object (false negative fail)');
  });

  it('test instanceOf (non-reserved)', () => {
    function Foo() {}
    new Foo().should.be.an.instanceOf(Foo);

    new Date().should.be.an.instanceOf(Date);

    const tobi = { name: 'Tobi', age: 2 };
    tobi.should.be.an.instanceOf(Object);

    const getSomething = () => 'something';
    getSomething.should.be.an.instanceOf(Function);

    err(() => {
      (9).should.an.instanceOf(Foo);
    }, 'expected 9 to be an instance of Foo');

    err(() => {
      (9).should.an.instanceOf(Foo, 'foo');
    }, 'foo');

    function Foo2() {}
    Foo2.prototype.valueOf = () => 'foo';
    new Foo2().should.be.an.instanceOf(Foo2);
  });

  it('test Function', () => {
    const f = () => {};
    f.should.be.a.Function();

    Object.should.be.a.Function();

    Function.should.be.a.Function();

    new Function('1 * 1').should.be.a.Function();

    err(
      () => {
        (1).should.be.a.Function();
      },
      'expected 1 to be a function',
      '    expected 1 to have type function',
      "        expected 'number' to be 'function'"
    );
  });

  it('test Object', () => {
    ({}).should.be.an.Object();
    Function.should.not.be.an.Object();

    new Object().should.be.an.Object();
    new Date().should.be.an.Object();

    err(
      () => {
        (1).should.be.an.Object();
      },
      'expected 1 to be an object',
      '    expected 1 to have type object',
      "        expected 'number' to be 'object'"
    );
  });

  it('test String', () => {
    ''.should.be.a.String;
    ({}).should.not.be.a.String;
    (0).should.not.be.a.String;

    new String('').should.be.a.String;
    //but
    should(new String('')).not.be.a.String;

    err(
      () => {
        (1).should.be.a.String();
      },
      'expected 1 to be a string',
      '    expected 1 to have type string',
      "        expected 'number' to be 'string'"
    );
  });

  it('test Array', () => {
    [].should.be.an.Array();
    new Array(10).should.be.an.Array();

    ''.should.not.be.Array();
    (1).should.not.be.Array();

    err(() => {
      [].should.not.be.Array();
    }, 'expected Array [] not to be an array (false negative fail)');
  });

  it('test Number', () => {
    (1).should.be.a.Number();
    new Number(10).should.be.a.Number();
    //but
    should(new Number(10)).should.not.be.a.Number();

    Number.NaN.should.be.a.Number();
    Number.POSITIVE_INFINITY.should.be.a.Number();

    ({}).should.not.be.a.Number();

    err(
      () => {
        [].should.be.a.Number();
      },
      'expected Array [] to be a number',
      '    expected Array [] to have type number',
      "        expected 'object' to be 'number'"
    );
  });

  it('test Boolean', () => {
    true.should.be.a.Boolean();
    false.should.be.a.Boolean();

    new Boolean(false).should.be.a.Boolean();
    //but
    should(new Boolean(false)).should.not.be.a.Boolean();

    ({}).should.not.be.a.Boolean();

    err(
      () => {
        [].should.be.a.Boolean();
      },
      'expected Array [] to be a boolean',
      '    expected Array [] to have type boolean',
      "        expected 'object' to be 'boolean'"
    );
  });

  it('test Error', () => {
    new Error().should.be.an.Error();

    ({}).should.not.be.Error();

    const ae = new AssertionError({ actual: 10, operator: 'to fail' });
    ae.should.be.an.Error();

    const AsyncTimeoutError = function AsyncTimeoutError(msg) {
      msg && (this.message = msg);
      Error.apply(this, arguments);
      Error.captureStackTrace?.(this, AsyncTimeoutError);
    };
    util.inherits(AsyncTimeoutError, Error);
    AsyncTimeoutError.prototype.name = AsyncTimeoutError.name;

    const e = new AsyncTimeoutError('foo');
    e.should.be.an.Error();

    err(
      () => {
        [].should.be.an.Error();
      },
      'expected Array [] to be an error',
      '    expected Array [] to be an instance of Error'
    );
  });

  it('test Date', () => {
    new Date().should.be.a.Date();
    new Date(Date.now()).should.be.a.Date();
    new Date('foo').should.be.a.Date();

    'foo'.should.not.be.a.Date();

    err(
      () => {
        [].should.be.a.Date();
      },
      'expected Array [] to be a date',
      '    expected Array [] to be an instance of Date'
    );
  });
});
