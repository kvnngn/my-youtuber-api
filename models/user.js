'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('users', {
    email: DataTypes.STRING(100),
    type: DataTypes.STRING(100),
    password: DataTypes.STRING(200),
    civility: DataTypes.ENUM('Mr', 'Mrs'),
    firstname: DataTypes.STRING(100),
    lastname: DataTypes.STRING(100),
  }, {freezeTableName: true,
    timestamps: false});
    User.associate = function(models) {
    // associations can be defined here
    models.User.hasMany(models.Comment);
    models.User.hasMany(models.Favorite);
    models.User.hasMany(models.Article);
  };
  return User;
};
