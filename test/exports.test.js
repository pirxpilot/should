import assert from 'node:assert';
import test from 'node:test';
import should from '../lib/index.js';

test('should global', () => {
  assert(typeof global.should === 'function');
});

test('should default export', () => {
  assert(typeof should === 'function');
  assert(typeof should.Assertion === 'function');
});
