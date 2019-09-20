'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define (
    'messages',
    {
      channel_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  Message.associate = function (models) {
    // associations can be defined here
    models.Message.belongsTo (models.Channel, {
      foreingKey: {
        allowNull: false,
      },
    });
    models.Message.belongsTo (models.User, {
      foreingKey: {
        allowNull: false,
      },
    });
  };
  return Message;
};
