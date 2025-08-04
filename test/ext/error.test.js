import { describe, it } from 'node:test';
import { err } from '../util.js';
import '../../lib/index.js';

describe('error', () => {
  it('test throw()', () => {
    err(() => {
      'a'.should.throw();
    }, "expected 'a' to be a function\n    expected 'a' to have type function\n        expected 'string' to be 'function'");

    (() => {}).should.not.throw();
    (() => {
      throw new Error('fail');
    }).should.throw();

    err(() => {
      (() => {}).should.throw();
    }, "expected Function { name: '' } to throw exception");

    err(() => {
      (() => {
        throw new Error('fail');
      }).should.not.throw();
    }, /expected Function \{ name: '' \} not to throw exception \(got Error \{[\s\S]*message: 'fail'[\s\S]*\}\)/);
  });

  it('test throw() with regex message', () => {
    (() => {
      throw new Error('fail');
    }).should.throw(/fail/);

    err(() => {
      (() => {}).should.throw(/fail/);
    }, "expected Function { name: '' } to throw exception");

    err(() => {
      (() => {
        throw new Error('error');
      }).should.throw(/fail/);
    }, "expected Function { name: '' } to throw exception with a message matching /fail/, but got 'error'");
  });

  it('test throw() with string message', () => {
    (() => {
      throw new Error('fail');
    }).should.throw('fail');

    err(() => {
      (() => {}).should.throw('fail');
    }, "expected Function { name: '' } to throw exception");

    err(() => {
      (() => {
        throw new Error('error');
      }).should.throw('fail');
    }, "expected Function { name: '' } to throw exception with a message matching 'fail', but got 'error'");
  });

  it('test throw() with type', () => {
    (() => {
      throw new Error('fail');
    }).should.throw(Error);

    err(() => {
      (() => {}).should.throw(Error);
    }, "expected Function { name: '' } to throw exception");

    err(() => {
      (() => {
        throw 'error';
      }).should.throw(Error);
    }, "expected Function { name: '' } to throw exception of type Error, but got String");
  });

  it('test throwError()', () => {
    (() => {}).should.not.throwError();
    (() => {
      throw new Error('fail');
    }).should.throwError();

    err(() => {
      (() => {}).should.throwError();
    }, "expected Function { name: '' } to throw exception");

    err(() => {
      (() => {
        throw new Error('fail');
      }).should.not.throwError();
    }, /expected Function \{ name: '' \} not to throw exception \(got Error \{[\s\S]*message: 'fail'[\s\S]*\}\)/);
  });

  it('test throwError() with regex message', () => {
    (() => {
      throw new Error('fail');
    }).should.throwError(/fail/);

    err(() => {
      (() => {}).should.throwError(/fail/);
    }, "expected Function { name: '' } to throw exception");

    err(() => {
      (() => {
        throw new Error('error');
      }).should.throwError(/fail/);
    }, "expected Function { name: '' } to throw exception with a message matching /fail/, but got 'error'");
  });

  it('test throwError() with string message', () => {
    (() => {
      throw new Error('fail');
    }).should.throwError('fail');

    err(() => {
      (() => {}).should.throwError('fail');
    }, "expected Function { name: '' } to throw exception");

    err(() => {
      (() => {
        throw new Error('error');
      }).should.throwError('fail');
    }, "expected Function { name: '' } to throw exception with a message matching 'fail', but got 'error'");
  });

  it('test throwError() with type', () => {
    (() => {
      throw new Error('fail');
    }).should.throw(Error);

    err(() => {
      (() => {}).should.throw(Error);
    }, "expected Function { name: '' } to throw exception");

    err(() => {
      (() => {
        throw 'error';
      }).should.throw(Error);
    }, "expected Function { name: '' } to throw exception of type Error, but got String");
  });

  it('test .throw(err, properties) with matching error', () => {
    const error = new Error();
    error.a = 10;
    (() => {
      throw error;
    }).should.throw(Error, { a: 10 });

    err(() => {
      (() => {
        throw error;
      }).should.throw(Error, { a: 11 });
    }, /expected Function \{ name: '' \} to throw exception: expected Error \{[\s\S]*a: 10,[\s\S]*message: ''[\s\S]*\} to match Object \{ a: 11 \}\n\s{4}not matched properties: a \(10\)/);
  });

  it('test .throw(properties) with matching error', () => {
    const error = new Error();
    error.a = 10;
    (() => {
      throw error;
    }).should.throw({ a: 10 });

    err(() => {
      (() => {
        throw error;
      }).should.throw({ a: 11 });
    }, /expected Function \{ name: '' \} to throw exception: expected Error \{[\s\S]*a: 10,[\s\S]*message: ''[\s\S]*\} to match Object \{ a: 11 \}\n\s{4}not matched properties: a \(10\)/);
  });
});
