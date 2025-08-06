import should from '../lib/should.js';

export function err(fn, ...msgs) {
  const msg = msgs.length > 1 ? msgs.join('\n') : msgs[0];

  let ok = true;
  try {
    fn();
    ok = false;
  } catch (err) {
    if ((typeof msg === 'string' && err.message !== msg) || (msg instanceof RegExp && !msg.test(err.message))) {
      throw new should.AssertionError({
        message: [
          'Expected message does not match',
          `expected: ${should.format(msg)}`,
          `  actual: ${should.format(err.message)}`
        ].join('\n'),
        expected: msg,
        actual: err.message,
        stackStartFunction: err
      });
    }
  }
  if (!ok) throw new Error('expected an error');
}
