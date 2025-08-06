/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2017 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

import { AssertionError as NodeAssertionError } from 'node:assert';
import { format } from './format.js';

/**
 * should AssertionError
 * @param {Object} options
 */
export default class AssertionError extends NodeAssertionError {
  constructor(params) {
    if (typeof params === 'string') {
      super({ message: params });
      return;
    }
    let { message, operator, actual, expected } = params;
    if (!message) {
      message = AssertionError.generateMessage(params);
    }
    super({
      message,
      actual,
      expected,
      operator,
      stackStartFn: params.stackStartFunction
    });
  }

  static generateMessage(params) {
    if (!params.operator && params.previous) {
      return params.previous.message;
    }
    const actual = format(params.actual);
    const expected = 'expected' in params ? ` ${format(params.expected)}` : '';
    const details = 'details' in params && params.details ? ` (${params.details})` : '';

    const previous = params.previous ? `\n${indentLines(params.previous.message)}` : '';

    return `expected ${actual}${params.negate ? ' not ' : ' '}${params.operator}${expected}${details}${previous}`;
  }
}

const indent = '    ';
function prependIndent(line) {
  return indent + line;
}

function indentLines(text) {
  return text.split('\n').map(prependIndent).join('\n');
}
