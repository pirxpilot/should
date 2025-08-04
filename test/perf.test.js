import test from 'node:test';
import '../lib/index.js';

function mockComplexObject(prefix, depth, width) {
  if (depth <= 0) {
    return `value-${prefix}`;
  }
  const obj = {};
  for (let i = 0; i < width; i++) {
    obj[`${prefix + depth}_${i}`] = mockComplexObject(prefix, depth - 1, width);
  }
  return obj;
}
const a = mockComplexObject('a', 8, 4);
const b = mockComplexObject('b', 8, 4);

test('should optimize not.equal for complex objects', () => {
  a.should.be.not.equal(b); // It takes a while
});
