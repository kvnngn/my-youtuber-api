'use strict';
const config = require ('../config');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return module.exports.down (queryInterface, Sequelize);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.resolve ()
      .then (() => queryInterface.bulkDelete ('users'))
      .then (() => queryInterface.bulkDelete ('channels'))
      .then (() => queryInterface.bulkDelete ('youtubers'))
      .then (() => queryInterface.bulkDelete ('favorites'))
      .then (() => queryInterface.bulkDelete ('messages'));
  },
};
