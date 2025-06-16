const jwt = require('jsonwebtoken');
const { Professional } = require('../models/Professional');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const professional = await Professional.findByPk(decoded.id);
    
    if (!professional) {
      return res.status(401).json({ error: 'Professional not found' });
    }

    req.professional = professional;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

module.exports = authMiddleware;