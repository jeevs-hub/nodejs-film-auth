var jwt = require('jsonwebtoken');

verifyToken = (req, res, next) => {
    console.log("the headers", req.headers);
  var token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ message: 'Authorisation not provided.' });
  jwt.verify(token, "secret", function(err, decoded) {
    if (err)
    return res.status(403).send({ message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;
