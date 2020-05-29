const jwt = require('jsonwebtoken');
const config = require('config');

function auth(...roles) {

    return (req, res, next) => {

        const token = req.header('x-auth-token');  // retrieve auth token from request headers
        if (!token) return res.status(401).send('Authentication required.');

        try {

            // decode token using private key
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            req.user = decoded;

            if (roles.some(any => any === decoded.role)) return next();

            res.status(401).send('Access Denied.');

        } catch (e) {
            res.status(400).send('Invalid Auth Token.');
        }

    };
}

module.exports = auth;