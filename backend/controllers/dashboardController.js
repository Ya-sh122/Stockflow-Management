const { Product, Organization } = require('../models');
const { withStockStatus } = require('../services/stockService');

// get /api/dashboard
exports.getSummary = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const organization = await Organization.findByPk(organizationId);
    const orgDefault = organization ? organization.defaultLowStockThreshold : 5;

    const products = await Product.findAll({
      where: { organizationId },
      order: [['name', 'ASC']],
    });

    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, product) => sum + product.quantityOnHand, 0);

    const lowStockItems = withStockStatus(products, orgDefault)
      .filter((product) => product.isLowStock)
      .map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        quantityOnHand: product.quantityOnHand,
        lowStockThreshold: product.effectiveThreshold,
      }));

    res.status(200).json({
      totalProducts,
      totalQuantity,
      defaultLowStockThreshold: orgDefault,
      lowStockItems,
    });
  } catch (err) {
    console.error('dashboard error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};
