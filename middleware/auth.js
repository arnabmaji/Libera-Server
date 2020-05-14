const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');  // retrieve auth token from request headers
    if (!token) return res.status(401).send('Authentication required.');

    const decoded = jwt.decode(token, config.get('jwtPrivateKey'));  // decode token using private key
    if (!decoded) return res.status(400).send('Invalid auth token');  // if it is not decoded successfully, token is invalid
    req.user = decoded;  // add decoded token in req
    next();  // next middleware
}