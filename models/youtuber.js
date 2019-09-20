'use strict';
module.exports = (sequelize, DataTypes) => {
  var Youtuber = sequelize.define (
    'youtubers',
    {
      name: DataTypes.STRING (100),
      nb_subs: DataTypes.STRING (200),
      nb_views: DataTypes.STRING (100),
      nb_videos: DataTypes.STRING (100),
      subscribers_rank: DataTypes.STRING (100),
      subscribers_views_rank: DataTypes.STRING (100),
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  Youtuber.associate = function (models) {
    // associations can be defined here
    models.Youtuber.hasOne (models.Channel, {
      foreingKey: {
        allowNull: false,
      },
    });
  };
  return Youtuber;
};
