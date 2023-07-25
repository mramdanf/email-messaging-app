'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SendingMessagesStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User);
      this.belongsTo(models.Messages);
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
      sentStatus: {
        type: DataTypes.ENUM,
        values: ['success', 'error']
      },
      sentTime: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'SendingMessagesStatus'
    }
  );
  return SendingMessagesStatus;
};
