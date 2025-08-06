import { it } from 'node:test';
import should from '../../lib/index.js';

function promised(value) {
  return new Promise(resolve => {
    resolve(value);
  });
}

function promiseFail() {
  return new Promise((_resolve, reject) => {
    reject(new Error('boom'));
  });
}

function promiseFailTimeout() {
  return new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error('boom'));
    }, 1000);
  });
}

it('should return new assertion to hold promise', () => {
  const a = promised('abc').should.finally;
  return a.then.should.be.a.Function();
});

it('should determine if it is Promise', () => {
  promised('a').should.be.a.Promise();
});

it('should allow to chain calls like with usual assertion', () =>
  promised('abc').should.finally.be.exactly('abc').and.be.a.String());

it('should allow to use .not and .any', () =>
  promised({ a: 10, b: 'abc' }).should.finally.not.have.any.of.properties('c', 'd').and.have.property('a', 10));

it('should treat assertion like promise', () =>
  Promise.all([promised(10).should.finally.be.a.Number(), promised('abc').should.finally.be.a.String()]));

it('should propagate .not before .finally', () => promised(10).should.not.finally.be.a.String());

it('should be possible to use .eventually as an alias for .finally', () =>
  promised(10).should.eventually.be.a.Number());

it('should allow to check if promise fulfilled', () =>
  Promise.all([
    promised(10).should.be.fulfilled(), //positive
    promiseFail()
      .should.be.fulfilled()
      .then(
        () => {
          //negative
          should.fail();
        },
        err => {
          err.should.be.Error().and.match({
            message:
              /expected \[Promise\] to be fulfilled, but it was rejected with Error \{[\s\S]*message: 'boom'[\s\S]*\}/
          });
        }
      ),
    promised(10)
      .should.not.be.fulfilled()
      .then(
        () => {
          //positive fail
          should.fail();
        },
        err => {
          err.should.be.Error().and.match({ message: 'expected [Promise] not to be fulfilled' });
        }
      ),
    promiseFail().should.not.be.fulfilled(), //negative fail
    promised(10).should.be.resolved(),
    promised(10).should.be.resolvedWith(10)
  ]));

it('should be allow to check if promise is fulfilledWith a value', () =>
  Promise.all([
    promised(10).should.be.fulfilledWith(10), //positive
    promiseFail()
      .should.be.fulfilledWith(10)
      .then(
        () => {
          //negative
          should.fail();
        },
        err => {
          err.should.be.Error().and.match({
            message:
              /expected \[Promise\] to be fulfilled with 10, but it was rejected with Error \{[\s\S]*message: 'boom'[\s\S]*\}/
          });
        }
      ),
    promised(10)
      .should.not.be.fulfilledWith(10)
      .then(
        () => {
          //positive fail
          should.fail();
        },
        err => {
          err.should.be.Error().and.match({
            message: 'expected [Promise] not to be fulfilled with 10'
          });
        }
      ),
    promiseFail().should.not.be.fulfilledWith(10) //negative fail
  ]));

it('should be allow to check if promise rejected', () =>
  Promise.all([
    promiseFail().should.be.rejected(), //positive
    promised(10)
      .should.be.rejected()
      .then(
        () => {
          //negative
          should.fail();
        },
        err => {
          err.should.be.Error().and.match({
            message: 'expected [Promise] to be rejected, but it was fulfilled with 10'
          });
        }
      ),
    promiseFail()
      .should.not.be.rejected()
      .then(
        () => {
          //positive fail
          should.fail();
        },
        err => {
          err.should.be.Error().and.match({ message: 'expected [Promise] not to be rejected' });
        }
      ),
    promised(10).should.not.be.rejected() //negative fail
  ]));

it('should allow to match rejected error', () =>
  Promise.all([
    promiseFail().should.be.rejectedWith(Error),
    promiseFail().should.be.rejectedWith('boom'),
    promiseFail()
      .should.be.rejectedWith('boom1')
      .then(
        () => should.fail(),
        err =>
          err.should.be.Error().and.match({
            message: "expected [Promise] to be rejected with a message matching 'boom1', but got 'boom'"
          })
      ),
    promiseFail().should.be.rejectedWith(/boom/),
    promiseFail().should.be.rejectedWith(Error, { message: 'boom' }),
    promiseFail().should.be.rejectedWith({ message: 'boom' }),
    promiseFail()
      .should.not.be.rejectedWith()
      .then(
        () =>
          //positive fail
          should.fail(),
        err => err.should.be.Error().and.match({ message: 'expected [Promise] not to be rejected' })
      ),
    promised(10)
      .should.be.rejectedWith()
      .then(
        () =>
          //negative fail
          should.fail(),
        err => err.should.be.Error().and.match({ message: 'expected [Promise] to be rejected' })
      ),
    promiseFail()
      .should.not.be.rejectedWith(Error)
      .then(
        () =>
          //negative fail
          should.fail(),
        err => err.should.be.Error().and.match({ message: 'expected [Promise] not to be rejected' })
      )
  ]));

it('should properly check async promise', () =>
  promiseFailTimeout().should.be.rejectedWith(Error, {
    message: 'boom'
  }));
