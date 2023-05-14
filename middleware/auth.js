const jwt = require('jsonwebtoken');

exports.authenticate = async function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send({ msg: 'No token ,auth denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded.user;
    req.jwtToken = token;
    next();
  } catch (err) {
    res.status(401).send({ msg: 'token is invalid' });
  }
};