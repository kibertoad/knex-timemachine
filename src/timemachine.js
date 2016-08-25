/**
 * Created by IgorSavin on 8/25/2016.
 */

function Timemachine() {
  this.trx;
  this.knexUsers;
}

Timemachine.prototype.startTransaction = startTransaction;
Timemachine.prototype.rollbackTransaction = rollbackTransaction;

/**
 * Initiates transaction for later rollback. Use it in beforeEach statement as the last statement since it will
 * invoke "done" after completion.
 * @param done - beforeEach callback
 * @param knex - knex instance that should be used for producing the transaction
 * @param knexUsers - should implement "setKnex" method that accepts Knex instance as a parameter
 */
function startTransaction(done, knex, knexUsers) {
  knex.transaction(function (newTrx) {
    this.trx = newTrx;
    this.knexUsers = knexUsers;
    for (x in knexUsers) {
      knexUser = knexUsers[x];
      if (typeof knexUser.setKnex !== 'function') {
        throw ("knexUser " + x + " does not implement setKnex function.");
      }

      knexUser.setKnex(trx);
    }
    done();
  })
    .catch(function (err) {
      console.log('Error on transaction start: ' + err);
    });
}

/**
 * Rollbacks current transaction. Use it in afterEach statement as the last statement since it will
 * invoke "done" after completion.
 * @param done afterEach callback
 * @param knex original knex that should be set back for all users
 */
function rollbackTransaction(done, knex) {
  trx.rollback().then(function () {
    for (x in this.knexUsers) {
      knexUsers[x].setKnex(knex);
    }
    done();
  })
    .catch(function (err) {
      console.log('Error on rollback: ' + err);
    });
}

//use it like this:
//  var knexTimemachine = new (require('knex-timemachine'));
module.exports = Timemachine;