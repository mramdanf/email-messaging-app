
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING(100),
      birthDayDate: DataTypes.DATE,
      location: DataTypes.STRING(100),
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};