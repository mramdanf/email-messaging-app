module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define(
    'Messages',
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
      tableName: 'messages',
      timestamps: false
    }
  );
  return Messages;
};
