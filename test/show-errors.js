import test from 'node:test';
import '../lib/index.js';

const person = { name: 'Karol' };

test('should fail property', () => {
  person.should.have.property('name', 'Charles');
});

test('should fail deep equal', () => {
  person.should.deepEqual({ name: 'Charles' });
});

test('assert fail', t => {
  t.assert.equal(person.name, 'Charles', 'person should have property name === "Charles"');
});
