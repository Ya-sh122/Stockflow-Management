const Organization = require('./organization');
const User = require('./user');
const Product = require('./product');

Organization.hasMany(User, { foreignKey: 'organizationId', onDelete: 'CASCADE' });
User.belongsTo(Organization, { foreignKey: 'organizationId' });

Organization.hasMany(Product, { foreignKey: 'organizationId', onDelete: 'CASCADE' });
Product.belongsTo(Organization, { foreignKey: 'organizationId' });

module.exports = { Organization, User, Product };
