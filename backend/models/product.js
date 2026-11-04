const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // unique: 'org_sku' makes sku unique per organization, not globally
  organizationId: { type: DataTypes.INTEGER, allowNull: false, unique: 'org_sku' },
  name: { type: DataTypes.STRING(150), allowNull: false },
  sku: { type: DataTypes.STRING(80), allowNull: false, unique: 'org_sku' },
  description: { type: DataTypes.TEXT, allowNull: true },
  quantityOnHand: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  costPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  sellingPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  lowStockThreshold: { type: DataTypes.INTEGER, allowNull: true },
  lastUpdatedBy: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'products',
  underscored: true,
});

module.exports = Product;
