/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */
import { merge } from 'should-util';
import { format } from './format.js';
import { functionName } from './util.js';

/**
 * should AssertionError
 * @param {Object} options
 * @constructor
 * @memberOf should
 * @static
 */
export default function AssertionError(options) {
  merge(this, options);

  if (!options.message) {
    Object.defineProperty(this, 'message', {
      get() {
        if (!this._message) {
          this._message = this.generateMessage();
          this.generatedMessage = true;
        }
        return this._message;
      },
      configurable: true,
      enumerable: false
    });
  }

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    const err = new Error();
    if (err.stack) {
      let out = err.stack;

      if (this.stackStartFunction) {
        // try to strip useless frames
        const fn_name = functionName(this.stackStartFunction);
        const idx = out.indexOf(`\n${fn_name}`);
        if (idx >= 0) {
          // once we have located the function frame
          // we need to strip out everything before it (and its line)
          const next_line = out.indexOf('\n', idx + 1);
          out = out.substring(next_line + 1);
        }
      }

      this.stack = out;
    }
  }
}

const indent = '    ';
function prependIndent(line) {
  return indent + line;
}

function indentLines(text) {
  return text.split('\n').map(prependIndent).join('\n');
}

// assert.AssertionError instanceof Error
AssertionError.prototype = Object.create(Error.prototype, {
  name: {
    value: 'AssertionError'
  },

  generateMessage: {
    value() {
      if (!this.operator && this.previous) {
        return this.previous.message;
      }
      const actual = format(this.actual);
      const expected = 'expected' in this ? ` ${format(this.expected)}` : '';
      const details = 'details' in this && this.details ? ` (${this.details})` : '';

      const previous = this.previous ? `\n${indentLines(this.previous.message)}` : '';

      return `expected ${actual}${this.negate ? ' not ' : ' '}${this.operator}${expected}${details}${previous}`;
    }
  }
});
