/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import AssertionError from '../assertion-error.js';
import assert from './_assert.js';

export default function (should) {
  const i = should.format;

  /*
   * Expose assert to should
   *
   * This allows you to do things like below
   * without require()ing the assert module.
   *
   *    should.equal(foo.bar, undefined);
   *
   */
  Object.assign(should, assert);

  /**
   * Assert _obj_ exists, with optional message.
   *
   * @static
   * @memberOf should
   * @category assertion assert
   * @alias should.exists
   * @param {*} obj
   * @param {String} [msg]
   * @example
   *
   * should.exist(1);
   * should.exist(new Date());
   */
  should.exist = should.exists = (obj, msg) => {
    if (null == obj) {
      throw new AssertionError({
        message: msg || `expected ${i(obj)} to exist`,
        stackStartFunction: should.exist
      });
    }
  };

  should.not = {};
  /**
   * Asserts _obj_ does not exist, with optional message.
   *
   * @name not.exist
   * @static
   * @memberOf should
   * @category assertion assert
   * @alias should.not.exists
   * @param {*} obj
   * @param {String} [msg]
   * @example
   *
   * should.not.exist(null);
   * should.not.exist(void 0);
   */
  should.not.exist = should.not.exists = (obj, msg) => {
    if (null != obj) {
      throw new AssertionError({
        message: msg || `expected ${i(obj)} to not exist`,
        stackStartFunction: should.not.exist
      });
    }
  };
}
