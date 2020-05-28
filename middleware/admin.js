/*
* Admin authentication middleware
 */

module.exports = (req,res, next) => {
    // TODO: Enable admin middleware after testing
    // if (!req.user.is_admin) return res.status(403).send('Access denied.');
    next();
};