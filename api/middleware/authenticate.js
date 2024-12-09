const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  console.log('ACCESS MIDDLEWARE');
  const token = req.headers['authorization'];

  console.log('TOKEN: ');
  console.log(req.headers);

  if (!token) {
      return res.status(403).json({ message: 'Token is required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          console.log('ERROR IN JWT');
          return res.status(403).json({ message: 'Invalid token.' , success: false});
      }
      req.user = user;
      next();
  });
};

module.exports = { authenticateJWT };