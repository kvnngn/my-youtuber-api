'use strict';

var fs = require ('fs');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return checkIfCauSportsNewsDatabaseExists ().then (function (res) {
      if (!res) {
        return initializeDatabaseAsFirstTime ();
      }
    });

    function checkIfCauSportsNewsDatabaseExists () {
      return queryInterface.sequelize
        .query ('SELECT * FROM `SequelizeMeta`', {
          type: Sequelize.QueryTypes.SELECT,
        })
        .then (function (metas) {
          return metas.length > 0;
        });
    }

    function initializeDatabaseAsFirstTime () {
      console.log ('**********************************************');
      console.log ('   CREATION OF THE  NEWS DATABASE   ');
      console.log ('**********************************************');

      var sql = fs.readFileSync (__dirname + '/db.sql', 'utf-8');
      var tables = sql.split (';');
      return Promise.resolve ()
        .then (function () {
          return queryInterface.dropAllTables ();
        })
        .then (function () {
          for (var i = 0; tables.length - 1 > i; i++) {
            queryInterface.sequelize.query (tables[i]);
          }
        });
    }
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropAllTables ();
  },
};
