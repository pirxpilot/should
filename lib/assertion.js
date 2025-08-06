/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import AssertionError from './assertion-error.js';

// a bit hacky way how to get error to do not have stack
function LightAssertionError(options) {
  Object.assign(this, options);

  if (!options.message) {
    Object.defineProperty(this, 'message', {
      get() {
        if (!this._message) {
          this._message = this.generateMessage();
          this.generatedMessage = true;
        }
        return this._message;
      }
    });
  }
}

LightAssertionError.prototype = {
  generateMessage: AssertionError.prototype.generateMessage
};

/**
 * should Assertion
 * @param {*} obj Given object for assertion
 * @constructor
 * @memberOf should
 * @static
 */
export function Assertion(obj) {
  this.obj = obj;

  this.anyOne = false;
  this.negate = false;

  this.params = { actual: obj };
}

Assertion.prototype = {
  constructor: Assertion,

  /**
   * Base method for assertions.
   *
   * Before calling this method need to fill Assertion#params object. This method usually called from other assertion methods.
   * `Assertion#params` can contain such properties:
   * * `operator` - required string containing description of this assertion
   * * `obj` - optional replacement for this.obj, it is useful if you prepare more clear object then given
   * * `message` - if this property filled with string any others will be ignored and this one used as assertion message
   * * `expected` - any object used when you need to assert relation between given object and expected. Like given == expected (== is a relation)
   * * `details` - additional string with details to generated message
   *
   * @memberOf Assertion
   * @category assertion
   * @param {*} expr Any expression that will be used as a condition for asserting.
   * @example
   *
   * var a = new should.Assertion(42);
   *
   * a.params = {
   *  operator: 'to be magic number',
   * }
   *
   * a.assert(false);
   * //throws AssertionError: expected 42 to be magic number
   */
  assert(expr) {
    if (expr) {
      return this;
    }

    const params = this.params;

    if ('obj' in params && !('actual' in params)) {
      params.actual = params.obj;
    } else if (!('obj' in params) && !('actual' in params)) {
      params.actual = this.obj;
    }

    params.stackStartFunction = params.stackStartFunction || this.assert;
    params.negate = this.negate;

    params.assertion = this;

    if (this.light) {
      throw new LightAssertionError(params);
    }
    throw new AssertionError(params);
  },

  /**
   * Shortcut for `Assertion#assert(false)`.
   *
   * @memberOf Assertion
   * @category assertion
   * @example
   *
   * var a = new should.Assertion(42);
   *
   * a.params = {
   *  operator: 'to be magic number',
   * }
   *
   * a.fail();
   * //throws AssertionError: expected 42 to be magic number
   */
  fail() {
    return this.assert(false);
  },

  assertZeroArguments: args => {
    if (args.length !== 0) {
      throw new TypeError('This assertion does not expect any arguments. You may need to check your code');
    }
  }
};

/**
 * Assertion used to delegate calls of Assertion methods inside of Promise.
 * It has almost all methods of Assertion.prototype
 *
 * @param {Promise} obj
 */
export function PromisedAssertion(...args) {
  Assertion.apply(this, args);
}

/**
 * Make PromisedAssertion to look like promise. Delegate resolve and reject to given promise.
 *
 * @private
 * @returns {Promise}
 */

// biome-ignore lint/suspicious/noThenProperty: delegate `then` to promise
PromisedAssertion.prototype.then = function (resolve, reject) {
  return this.obj.then(resolve, reject);
};

/**
 * Way to extend Assertion function. It uses some logic
 * to define only positive assertions and itself rule with negative assertion.
 *
 * All actions happen in subcontext and this method take care about negation.
 * Potentially we can add some more modifiers that does not depends from state of assertion.
 *
 * @memberOf Assertion
 * @static
 * @param {String} name Name of assertion. It will be used for defining method or getter on Assertion.prototype
 * @param {Function} func Function that will be called on executing assertion
 * @example
 *
 * Assertion.add('asset', function() {
 *      this.params = { operator: 'to be asset' }
 *
 *      this.obj.should.have.property('id').which.is.a.Number()
 *      this.obj.should.have.property('path')
 * })
 */
Assertion.add = (name, func) => {
  Object.defineProperty(Assertion.prototype, name, {
    enumerable: true,
    configurable: true,
    value(...args) {
      const context = new Assertion(this.obj, this, name);
      context.anyOne = this.anyOne;
      context.onlyThis = this.onlyThis;
      // hack
      context.light = true;

      try {
        func.apply(context, args);
      } catch (e) {
        // check for fail
        if (e instanceof AssertionError || e instanceof LightAssertionError) {
          // negative fail
          if (this.negate) {
            this.obj = context.obj;
            this.negate = false;
            return this;
          }

          if (context !== e.assertion) {
            context.params.previous = e;
          }

          // positive fail
          context.negate = false;
          // hack
          context.light = false;
          context.fail();
        }
        // throw if it is another exception
        throw e;
      }

      // negative pass
      if (this.negate) {
        context.negate = true; // because .fail will set negate
        context.params.details = 'false negative fail';
        // hack
        context.light = false;
        context.fail();
      }

      // positive pass
      if (!this.params.operator) {
        this.params = context.params; // shortcut
      }
      this.obj = context.obj;
      this.negate = false;
      return this;
    }
  });

  Object.defineProperty(PromisedAssertion.prototype, name, {
    enumerable: true,
    configurable: true,
    value(...args) {
      this.obj = this.obj.then(a => a[name].apply(a, args));

      return this;
    }
  });
};

/**
 * Add chaining getter to Assertion like .a, .which etc
 *
 * @memberOf Assertion
 * @static
 * @param  {string} name   name of getter
 * @param  {function} [onCall] optional function to call
 */
Assertion.addChain = (name, onCall) => {
  onCall = onCall || (() => {});
  Object.defineProperty(Assertion.prototype, name, {
    get() {
      onCall.call(this);
      return this;
    },
    enumerable: true
  });

  Object.defineProperty(PromisedAssertion.prototype, name, {
    enumerable: true,
    configurable: true,
    get() {
      this.obj = this.obj.then(a => a[name]);

      return this;
    }
  });
};

/**
 * Create alias for some `Assertion` property
 *
 * @memberOf Assertion
 * @static
 * @param {String} from Name of to map
 * @param {String} to Name of alias
 * @example
 *
 * Assertion.alias('true', 'True')
 */
Assertion.alias = (from, to) => {
  const desc = Object.getOwnPropertyDescriptor(Assertion.prototype, from);
  if (!desc) {
    throw new Error(`Alias ${from} -> ${to} could not be created as ${from} not defined`);
  }
  Object.defineProperty(Assertion.prototype, to, desc);

  const desc2 = Object.getOwnPropertyDescriptor(PromisedAssertion.prototype, from);
  if (desc2) {
    Object.defineProperty(PromisedAssertion.prototype, to, desc2);
  }
};
/**
 * Negation modifier. Current assertion chain become negated. Each call invert negation on current assertion.
 *
 * @name not
 * @property
 * @memberOf Assertion
 * @category assertion
 */
Assertion.addChain('not', function () {
  this.negate = !this.negate;
});

/**
 * Any modifier - it affect on execution of sequenced assertion to do not `check all`, but `check any of`.
 *
 * @name any
 * @property
 * @memberOf Assertion
 * @category assertion
 */
Assertion.addChain('any', function () {
  this.anyOne = true;
});

/**
 * Only modifier - currently used with .keys to check if object contains only exactly this .keys
 *
 * @name only
 * @property
 * @memberOf Assertion
 * @category assertion
 */
Assertion.addChain('only', function () {
  this.onlyThis = true;
});
