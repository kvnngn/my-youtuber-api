'use strict';
module.exports = (sequelize, DataTypes) => {
  var Favorite = sequelize.define ('favorites', {
    freezeTableName: true,
    timestamps: false,
  });
  Favorite.associate = function (models) {
    // associations can be defined here
    models.Favorite.belongsTo (models.User, {
      foreingKey: {
        allowNull: false,
      },
    });
  };
  return Favorite;
};
