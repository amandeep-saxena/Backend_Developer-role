// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Task = sequelize.define('Task', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: DataTypes.TEXT,
//     },
//     dueDate: {
//         type: DataTypes.STRING,
//     },
//     priority: {
//         type: DataTypes.ENUM('low', 'medium', 'high'),
//     },
//     status: {
//         type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
//         defaultValue: 'pending',
//     },
//     userId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'User',
//             key: 'id',
//         },
//     },
//     assignedTo: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: user,
//             key: 'id',
//         },
//     },
// }, {
//     tableName: 'Task',
// });


// (async () => {
//     try {
//         await sequelize.sync({alter : true});

//     } catch (error) {
//         console.error("Error synchronizing database:", error);
//     }
// })();
// module.exports = Task;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('../models/user'); 

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    dueDate: {
        type: DataTypes.STRING, 
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
    },
    status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
        defaultValue: 'pending',
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, 
            key: 'id',
        },
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    tableName: 'Task',
});

(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized successfully.");
    } catch (error) {
        console.error("Error synchronizing database:", error);
    }
})();

module.exports = Task;
