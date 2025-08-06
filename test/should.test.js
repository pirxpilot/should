import { describe, it } from 'node:test';
import should from '../lib/index.js';

describe('should', () => {
  it('test assertion', () => {
    'test'.should.be.a.String;
    should.equal('foo', 'foo');
  });

  it('test .expected and .actual', t => {
    try {
      'foo'.should.equal('bar');
    } catch (err) {
      t.assert.equal(err.actual, 'foo', 'err.actual');
      t.assert.equal(err.expected, 'bar', 'err.expected');
    }
  });

  it('test chaining', () => {
    const user = { name: 'tj', pets: ['tobi', 'loki', 'jane', 'bandit'] };

    user.should.be.an.instanceOf(Object).and.have.property('name', 'tj');

    user.should.have.ownProperty('name').which.not.have.length(3).and.be.equal('tj');
  });
});
