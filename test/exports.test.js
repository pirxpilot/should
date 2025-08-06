import test from 'node:test';
import shouldGlobal, { Assertion, AssertionError, format, should } from '../lib/index.js';

test('should global', t => {
  t.assert.equal(typeof global.should, 'function');
});

test('should default export', t => {
  t.assert.equal(typeof shouldGlobal, 'function');
  t.assert.equal(typeof shouldGlobal.Assertion, 'function');
});

test('should named export', t => {
  t.assert.equal(typeof should, 'function');
  t.assert.equal(typeof Assertion, 'function');
  t.assert.equal(typeof AssertionError, 'function');
  t.assert.equal(typeof format, 'function');
});
