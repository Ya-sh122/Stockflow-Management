const { Organization } = require('../models');

// get /api/settings
exports.getSettings = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.user.organizationId);

    if (!organization) {
      return res.status(404).json({ message: 'organization not found' });
    }

    res.status(200).json({
      organizationName: organization.name,
      defaultLowStockThreshold: organization.defaultLowStockThreshold,
    });
  } catch (err) {
    console.error('get settings error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};

// put /api/settings
exports.updateSettings = async (req, res) => {
  try {
    const { defaultLowStockThreshold } = req.body;
    const threshold = Number(defaultLowStockThreshold);

    if (Number.isNaN(threshold) || threshold < 0) {
      return res.status(400).json({ message: 'threshold must be zero or a positive number' });
    }

    const organization = await Organization.findByPk(req.user.organizationId);

    if (!organization) {
      return res.status(404).json({ message: 'organization not found' });
    }

    await organization.update({ defaultLowStockThreshold: Math.round(threshold) });

    res.status(200).json({
      message: 'settings saved',
      defaultLowStockThreshold: organization.defaultLowStockThreshold,
    });
  } catch (err) {
    console.error('update settings error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};
