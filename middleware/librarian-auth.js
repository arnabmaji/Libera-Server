const auth = require('./auth');
const Roles = require('../models/roles');

module.exports = auth(Roles.ADMIN, Roles.LIBRARIAN);