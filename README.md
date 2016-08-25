# knex-timemachine

Simple library for automatically rollbacking knex transactions at the end of an automated test.

Example usage:

let knexTimemachine = new (require('knex-timemachine'));

<...>

var oldKnex = daoObject.getKnex();
  beforeEach(function (done) {
    knexTimemachine.startTransaction(done, oldKnex, [daoObject]);
  });

  afterEach(function (done) {
    knexTimemachine.rollbackTransaction(done, oldKnex);
  });