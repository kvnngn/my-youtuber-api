'use strict';
module.exports = (sequelize, DataTypes) => {
  var Channel = sequelize.define (
    'channels',
    {
      youtuber_id: DataTypes.INTEGER,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  Channel.associate = function (models) {
    models.Message.belongsTo (models.Youtuber, {
      foreingKey: {
        allowNull: false,
      },
    });
  };
  return Channel;
};
