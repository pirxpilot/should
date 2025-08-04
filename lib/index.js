import should from './should.js';

const defaultProto = Object.prototype;
const defaultProperty = 'should';

const freeGlobal = typeof global === 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
const freeSelf = typeof self === 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
const root = freeGlobal || freeSelf || Function('return this')();

//Expose api via `Object#should`.
try {
  const prevShould = should.extend(defaultProperty, defaultProto);
  should._prevShould = prevShould;

  Object.defineProperty(root, 'should', {
    enumerable: false,
    configurable: true,
    value: should
  });
} catch (_e) {
  //ignore errors
}

export default should;
