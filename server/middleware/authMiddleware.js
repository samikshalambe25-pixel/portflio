const jwt = require('jsonwebtoken');
const Store = require('../data/store');

const authMiddleware = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'supersecretportfoliojwtkey_2026_dev';
    const decoded = jwt.verify(token, secret);
    const user = Store.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = { id: user._id, email: user.email, username: user.username, role: user.role };
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
