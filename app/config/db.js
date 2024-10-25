const { Sequelize } = require("sequelize");
// require("dotenv").config();
// const env = process.env;


const sequelize = new Sequelize("backend_db", "root", "aman@12", {
  host: "localhost",
  dialect: "mysql",
});

// const sequelize = new Sequelize(env.database, env.user, env.password, {
//   host: env.host,
//   dialect: env.dialect,
//   logging: false,
//   operatorsAliases: 0,
//   pool: {
//     max: +env.max,
//     min: +env.min,
//     acquire: +env.acquire,
//     idle: +env.idle,
//   },
// });

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

module.exports = sequelize;
