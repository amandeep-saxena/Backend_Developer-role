const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
          
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
    
        },
        role: {
            type: DataTypes.ENUM('admin', 'manager', 'user'),
            defaultValue: 'user',
        },
    },
    {
        tableName: "User",
    }
);

(async () => {
    try {
        await sequelize.sync();

    } catch (error) {
        console.error("Error synchronizing database:", error);
    }
})();

module.exports = User;