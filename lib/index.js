import should from './should.js';

const defaultProto = Object.prototype;
const defaultProperty = 'should';

//Expose api via `Object#should`.
try {
  const prevShould = should.extend(defaultProperty, defaultProto);
  should._prevShould = prevShould;

  Object.defineProperty(globalThis, 'should', {
    enumerable: false,
    configurable: true,
    value: should
  });
} catch {
  //ignore errors
}

export default should;
