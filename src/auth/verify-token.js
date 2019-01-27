const userController = require('./user-controller');

verifyToken = (req, res, next) => {
  var token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ message: 'Authorisation not provided.' });
    userController.validateToken(token, (err, decoded) => {
      if(err) return res.status(403).send({ message: 'Failed to authenticate token.' });
      req.userId = decoded.id;
      next();
    })
  }

module.exports = verifyToken;
