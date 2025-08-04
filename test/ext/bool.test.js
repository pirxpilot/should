import { describe, it } from 'node:test';
import { err } from '../util.js';
import '../../lib/index.js';

describe('bool', () => {
  it('test true', () => {
    true.should.be.true();
    false.should.not.be.true();
    (1).should.not.be.true();

    err(() => {
      'test'.should.be.true();
    }, "expected 'test' to be true");

    err(() => {
      true.should.not.be.true();
    }, 'expected true not to be true (false negative fail)');

    err(() => {
      false.should.be.true('My text');
    }, 'My text');
  });

  it('test false', () => {
    false.should.be.false();
    true.should.not.be.false();
    (0).should.not.be.false();

    err(() => {
      ''.should.be.false();
    }, "expected '' to be false");

    err(() => {
      false.should.not.be.false();
    }, 'expected false not to be false (false negative fail)');

    err(() => {
      true.should.be.false('My text');
    }, 'My text');
  });

  it('test ok', () => {
    true.should.be.ok();
    false.should.not.be.ok();
    (1).should.be.ok();
    (0).should.not.be.ok();

    err(() => {
      ''.should.be.ok();
    }, "expected '' to be truthy");

    err(() => {
      'test'.should.not.be.ok();
    }, "expected 'test' not to be truthy (false negative fail)");
  });
});
