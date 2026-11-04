const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

// connect to mysql and create missing tables on start
async function initializeDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('mysql connected, tables ready');
}

module.exports = { sequelize, initializeDatabase };
