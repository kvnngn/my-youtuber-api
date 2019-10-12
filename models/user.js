'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define (
    'users',
    {
      nickname: DataTypes.STRING (100),
      email: DataTypes.STRING (256),
      password: DataTypes.STRING (200),
      firstname: DataTypes.STRING (100),
      lastname: DataTypes.STRING (100),
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  User.associate = function (models) {
    models.User.hasMany (models.Favorite);
    models.User.hasMany (models.Message);
  };
  return User;
};
