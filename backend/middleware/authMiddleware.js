const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'stockflow_dev_secret';

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'auth token missing' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // organizationId on every request keeps data separated per tenant
    req.user = { id: payload.id, email: payload.email, organizationId: payload.organizationId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'session expired, please log in again' });
  }
};

module.exports = { authMiddleware, JWT_SECRET };
