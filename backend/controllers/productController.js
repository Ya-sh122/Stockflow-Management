const { Op } = require('sequelize');
const { Product, Organization } = require('../models');
const { withStockStatus } = require('../services/stockService');

// empty form field becomes null so mysql stores null, not ''
const toNumberOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
};

const getOrgDefaultThreshold = async (organizationId) => {
  const organization = await Organization.findByPk(organizationId);
  return organization ? organization.defaultLowStockThreshold : 5;
};

// get /api/products?search=
exports.list = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const search = (req.query.search || '').trim();
    const where = { organizationId };

    if (search) {
      const term = `%${search}%`;
      where[Op.or] = [{ name: { [Op.like]: term } }, { sku: { [Op.like]: term } }];
    }

    const products = await Product.findAll({ where, order: [['createdAt', 'DESC']] });
    const orgDefault = await getOrgDefaultThreshold(organizationId);

    res.status(200).json(withStockStatus(products, orgDefault));
  } catch (err) {
    console.error('list products error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};

// get /api/products/:id
exports.getOne = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, organizationId: req.user.organizationId },
    });

    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }

    const orgDefault = await getOrgDefaultThreshold(req.user.organizationId);
    res.status(200).json(withStockStatus([product], orgDefault)[0]);
  } catch (err) {
    console.error('get product error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};

// post /api/products
exports.create = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const { name, sku, description, quantityOnHand, costPrice, sellingPrice, lowStockThreshold } = req.body;

    if (!name || !name.trim() || !sku || !sku.trim()) {
      return res.status(400).json({ message: 'name and sku are required' });
    }

    const cleanSku = sku.trim().toUpperCase();
    const duplicate = await Product.findOne({ where: { organizationId, sku: cleanSku } });

    if (duplicate) {
      return res.status(409).json({ message: 'this sku already exists in your store' });
    }

    const quantity = toNumberOrNull(quantityOnHand);

    if (quantity !== null && quantity < 0) {
      return res.status(400).json({ message: 'quantity cannot be negative' });
    }

    const product = await Product.create({
      organizationId,
      name: name.trim(),
      sku: cleanSku,
      description: description ? description.trim() : null,
      quantityOnHand: quantity === null ? 0 : quantity,
      costPrice: toNumberOrNull(costPrice),
      sellingPrice: toNumberOrNull(sellingPrice),
      lowStockThreshold: toNumberOrNull(lowStockThreshold),
      lastUpdatedBy: req.user.id,
    });

    res.status(201).json({ message: 'product created', product });
  } catch (err) {
    console.error('create product error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};

// put /api/products/:id
exports.update = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const product = await Product.findOne({ where: { id: req.params.id, organizationId } });

    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }

    const { name, sku, description, quantityOnHand, costPrice, sellingPrice, lowStockThreshold } = req.body;

    if (!name || !name.trim() || !sku || !sku.trim()) {
      return res.status(400).json({ message: 'name and sku are required' });
    }

    const cleanSku = sku.trim().toUpperCase();

    if (cleanSku !== product.sku) {
      const duplicate = await Product.findOne({ where: { organizationId, sku: cleanSku } });
      if (duplicate) {
        return res.status(409).json({ message: 'this sku already exists in your store' });
      }
    }

    const quantity = toNumberOrNull(quantityOnHand);

    if (quantity !== null && quantity < 0) {
      return res.status(400).json({ message: 'quantity cannot be negative' });
    }

    await product.update({
      name: name.trim(),
      sku: cleanSku,
      description: description ? description.trim() : null,
      quantityOnHand: quantity === null ? 0 : quantity,
      costPrice: toNumberOrNull(costPrice),
      sellingPrice: toNumberOrNull(sellingPrice),
      lowStockThreshold: toNumberOrNull(lowStockThreshold),
      lastUpdatedBy: req.user.id,
    });

    res.status(200).json({ message: 'product updated', product });
  } catch (err) {
    console.error('update product error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};

// delete /api/products/:id
exports.remove = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, organizationId: req.user.organizationId },
    });

    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }

    await product.destroy();
    res.status(200).json({ message: 'product deleted' });
  } catch (err) {
    console.error('delete product error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};
