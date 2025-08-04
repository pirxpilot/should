import { describe, it } from 'node:test';
import should from '../lib/should.js';

function err(fn, msg) {
  try {
    fn();
    should.fail('expected an error');
  } catch (err) {
    should.equal(msg, err.message);
  }
}

function err_should_exist(obj) {
  err(
    () => {
      should.exist(obj);
    },
    `expected ${should.format(obj)} to exist`
  );
}

function err_should_not_exist(obj) {
  err(
    () => {
      should.not.exist(obj);
    },
    `expected ${should.format(obj)} to not exist`
  );
}

describe('exist', () => {
  // static should.exist() pass,
  it('test static should.exist() pass w/ bool', () => {
    should.exist(false);
  });

  it('test static should.exist() pass w/ number', () => {
    should.exist(0);
  });

  it('test static should.exist() pass w/ string', () => {
    should.exist('');
  });

  it('test static should.exist() pass w/ object', () => {
    should.exist({});
  });

  it('test static should.exist() pass w/ array', () => {
    should.exist([]);
  });

  // static should.exist() fail,
  it('test static should.exist() fail w/ null', () => {
    err_should_exist(null);
  });

  it('test static should.exist() fail w/ undefined', () => {
    err_should_exist(undefined);
  });

  // static should.not.exist() pass,
  it('test static should.not.exist() pass w/ null', () => {
    should.not.exist(null);
  });

  it('test static should.not.exist() pass w/ undefined', () => {
    should.not.exist(undefined);
  });

  // static should.not.exist() fail,
  it('test static should.not.exist() fail w/ bool', () => {
    err_should_not_exist(false);
  });

  it('test static should.not.exist() fail w/ number', () => {
    err_should_not_exist(0);
  });

  it('test static should.not.exist() fail w/ string', () => {
    err_should_not_exist('');
  });

  it('test static should.not.exist() fail w/ object', () => {
    err_should_not_exist({});
  });

  it('test static should.not.exist() fail w/ array', () => {
    err_should_not_exist([]);
  });
});
