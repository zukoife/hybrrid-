const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach minimal info from token first
    req.user = { id: decoded.id, email: decoded.email, name: decoded.name };

    // Optionally refresh from DB to ensure user still exists
    try {
      const user = await User.findById(decoded.id).select('name email');
      if (user) {
        req.user = { id: user._id.toString(), name: user.name, email: user.email };
      }
    } catch (_) {
      // Ignore DB errors here; token verification is primary
    }

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
