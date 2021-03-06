const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets.js');

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    jwt.verify(authorization, jwtSecret, (err) => {
      if (err) {
        res.status(401).json({ error: 'You are not authorized' });
      } else {
        next();
      }
    })
  } else {
    res.status(404).json({ error: 'authorization credentials not found' })
  }
}