/*
* Middleware for authentication of librarians
 */
const auth = require('./auth');

module.exports = (req, res, next) => {
    auth(req, res, next, 1);
}