const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Organization = sequelize.define('Organization', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  defaultLowStockThreshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
}, {
  tableName: 'organizations',
  underscored: true,
});

module.exports = Organization;
