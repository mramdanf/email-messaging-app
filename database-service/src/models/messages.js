'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.SendingMessagesStatus);
    }
  }
  Messages.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      messageType: DataTypes.STRING(100),
      messages: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Messages',
      tableName: 'messages',
      timestamps: false
    }
  );
  return Messages;
};
