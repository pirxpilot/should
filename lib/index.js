export { Assertion, AssertionError, format, should } from './should.js';

import should from './should.js';
export default should;

const defaultProto = Object.prototype;
const defaultProperty = 'should';

// Expose api via `Object#should`.
try {
  const prevShould = should.extend(defaultProperty, defaultProto);
  should._prevShould = prevShould;

  Object.defineProperty(globalThis, 'should', {
    enumerable: false,
    configurable: true,
    value: should
  });
} catch {
  // ignore errors
}
