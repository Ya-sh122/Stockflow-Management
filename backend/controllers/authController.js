const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organization } = require('../models');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const buildTokenForUser = (user) => jwt.sign(
  {
    id: user.id,
    email: user.email,
    organizationId: user.organizationId,
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

const shapeUser = (user, organization) => ({
  id: user.id,
  email: user.email,
  organizationId: user.organizationId,
  organizationName: organization ? organization.name : null,
});

// post /api/auth/register - creates organization and owner user together
exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword, organizationName } = req.body;

    if (!email || !password || !confirmPassword || !organizationName) {
      return res.status(400).json({
        message: 'email, password, confirm password and organization name are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'passwords do not match' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ where: { email: cleanEmail } });

    if (existingUser) {
      return res.status(409).json({ message: 'email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const organization = await Organization.create({ name: organizationName.trim() });
    const user = await User.create({
      organizationId: organization.id,
      email: cleanEmail,
      password: hashedPassword,
    });

    const token = buildTokenForUser(user);

    res.status(201).json({
      message: 'organization created',
      token,
      user: shapeUser(user, organization),
    });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};

// post /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
      include: [{ model: Organization }],
    });

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const token = buildTokenForUser(user);

    res.status(200).json({
      message: 'login successful',
      token,
      user: shapeUser(user, user.Organization),
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};

// get /api/auth/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'organizationId', 'createdAt'],
      include: [{ model: Organization }],
    });

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    res.status(200).json(shapeUser(user, user.Organization));
  } catch (err) {
    console.error('get profile error:', err);
    res.status(500).json({ message: 'server error', error: err.message });
  }
};
