import { describe, it } from 'node:test';
import { err } from '../util.js';
import '../../lib/index.js';

describe('string', () => {
  it('test startWith()', () => {
    'foobar'.should.startWith('foo');
    'foobar'.should.not.startWith('bar');

    err(() => {
      'foobar'.should.startWith('bar');
    }, "expected 'foobar' to start with 'bar'");

    err(() => {
      'foobar'.should.not.startWith('foo');
    }, "expected 'foobar' not to start with 'foo' (false negative fail)");

    err(() => {
      'foobar'.should.startWith('bar', 'baz');
    }, 'baz');

    err(() => {
      'foobar'.should.not.startWith('foo', 'baz');
    }, 'baz');
  });

  it('test endWith()', () => {
    'foobar'.should.endWith('bar');
    'foobar'.should.not.endWith('foo');

    err(() => {
      'foobar'.should.endWith('foo');
    }, "expected 'foobar' to end with 'foo'");

    err(() => {
      'foobar'.should.not.endWith('bar');
    }, "expected 'foobar' not to end with 'bar' (false negative fail)");

    err(() => {
      'foobar'.should.endWith('foo', 'baz');
    }, 'baz');

    err(() => {
      'foobar'.should.not.endWith('bar', 'baz');
    }, 'baz');
  });
});
