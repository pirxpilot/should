import { describe, it } from 'node:test';
import { err } from '../util.js';
import '../../lib/index.js';

describe('number', () => {
  it('test NaN', () => {
    Number.NaN.should.be.NaN();
    Number.POSITIVE_INFINITY.should.not.be.NaN();
    (0).should.not.be.NaN();
    false.should.not.be.NaN();
    ({}).should.not.be.NaN();
    ''.should.not.be.NaN();
    'foo'.should.not.be.NaN();
    /^$/.should.not.be.NaN();

    err(() => {
      Number.POSITIVE_INFINITY.should.be.NaN();
    }, 'expected Infinity to be NaN');

    err(() => {
      Number.NaN.should.not.be.NaN();
    }, 'expected NaN not to be NaN (false negative fail)');
  });

  it('test Infinity', () => {
    Number.NaN.should.not.be.Infinity();
    (1 / 0).should.be.Infinity();
    Number.POSITIVE_INFINITY.should.be.Infinity();
    (0).should.not.be.Infinity();
    false.should.not.be.Infinity();
    ({}).should.not.be.Infinity();
    ''.should.not.be.Infinity();
    'foo'.should.not.be.Infinity();
    /^$/.should.not.be.Infinity();

    err(() => {
      Number.NaN.should.be.Infinity();
    }, 'expected NaN to be Infinity\n    expected NaN not to be NaN (false negative fail)');

    err(() => {
      Number.POSITIVE_INFINITY.should.not.be.Infinity();
    }, 'expected Infinity not to be Infinity (false negative fail)');
  });

  it('test within(start, finish)', () => {
    (5).should.be.within(5, 10);
    (5).should.be.within(3, 6);
    (5).should.be.within(3, 5);
    (5).should.not.be.within(1, 3);

    err(() => {
      (5).should.not.be.within(4, 6);
    }, 'expected 5 not to be within 4..6 (false negative fail)');

    err(() => {
      (10).should.be.within(50, 100);
    }, 'expected 10 to be within 50..100');

    err(() => {
      (5).should.not.be.within(4, 6, 'foo');
    }, 'foo');

    err(() => {
      (10).should.be.within(50, 100, 'foo');
    }, 'foo');
  });

  it('test approximately(number, delta)', () => {
    (1.5).should.be.approximately(1.4, 0.2);
    (1.5).should.be.approximately(1.5, 10e-10);
    (1.5).should.not.be.approximately(1.4, 1e-2);

    err(() => {
      (99.99).should.not.be.approximately(100, 0.1);
    }, 'expected 99.99 not to be approximately 100 ±0.1 (false negative fail)');

    err(() => {
      (99.99).should.be.approximately(105, 0.1);
    }, 'expected 99.99 to be approximately 105 ±0.1');
  });

  it('test above(n)', () => {
    (5).should.be.above(2);
    (5).should.be.greaterThan(2);
    (5).should.not.be.above(5);
    (5).should.not.be.above(6);

    err(() => {
      (5).should.be.above(6);
    }, 'expected 5 to be above 6');

    err(() => {
      (10).should.not.be.above(6);
    }, 'expected 10 not to be above 6 (false negative fail)');

    err(() => {
      (5).should.be.above(6, 'foo');
    }, 'foo');

    err(() => {
      (10).should.not.be.above(6, 'foo');
    }, 'foo');
  });

  it('test below(n)', () => {
    (2).should.be.below(5);
    (2).should.be.lessThan(5);
    (5).should.not.be.below(5);
    (6).should.not.be.below(5);

    err(() => {
      (6).should.be.below(5);
    }, 'expected 6 to be below 5');

    err(() => {
      (6).should.not.be.below(10);
    }, 'expected 6 not to be below 10 (false negative fail)');

    err(() => {
      (6).should.be.below(5, 'foo');
    }, 'foo');

    err(() => {
      (6).should.not.be.below(10, 'foo');
    }, 'foo');
  });

  it('test aboveOrEqual(n)', () => {
    (5).should.be.aboveOrEqual(2);
    (5).should.be.aboveOrEqual(5);
    (5).should.not.be.aboveOrEqual(6);

    err(() => {
      (5).should.be.aboveOrEqual(6);
    }, 'expected 5 to be above or equal 6');
  });

  it('test belowOrEqual(n)', () => {
    (2).should.be.belowOrEqual(5);
    (5).should.be.belowOrEqual(5);
    (6).should.not.be.belowOrEqual(5);

    err(() => {
      (6).should.be.belowOrEqual(5);
    }, 'expected 6 to be below or equal 5');
  });
});
