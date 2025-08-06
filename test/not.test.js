import { describe, it } from 'node:test';
import '../lib/index.js';
import { err } from './util.js';

const a = 10;
const b = 11;

describe('.not', () => {
  it('should not throw when true', () => {
    a.should.be.exactly(a);
  });

  it('should throw when false', () => {
    err(() => {
      a.should.be.exactly(b);
    }, 'expected 10 to be 11');
  });

  it('should throw when not true (false negative case)', () => {
    err(() => {
      a.should.not.be.exactly(a);
    }, 'expected 10 not to be 10 (false negative fail)');
  });

  it('should not throw when not false', () => {
    a.should.not.be.exactly(b);
  });
});
