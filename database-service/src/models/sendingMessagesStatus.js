'use strict';

const { Model } = require('sequelize');
const { SENT_MESSAGE_STATUS } = require('../contants');

module.exports = (sequelize, DataTypes) => {
  class SendingMessagesStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
      this.belongsTo(models.Messages, {
        as: 'message',
        foreignKey: 'messageId'
      });
    }
  }
  SendingMessagesStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      messageId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Messages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      sentStatus: {
        type: DataTypes.ENUM,
        values: [SENT_MESSAGE_STATUS.SUCCESS, SENT_MESSAGE_STATUS.ERROR]
      },
      sentTime: DataTypes.STRING,
      descriptions: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'SendingMessagesStatus',
      tableName: 'sendingMessagesStatus',
      timestamps: false
    }
  );
  return SendingMessagesStatus;
};
