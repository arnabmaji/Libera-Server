const database = require('./db');
const Joi = require('joi');

async function getLibrarianByEmail(email) {
    const rows = await database.query('SELECT * FROM librarians WHERE email = ?', email);
    return rows[0];
}

function validateLibrarianParams(user) {
    /*
    * Validate librarian params in request body
     */
    const schema = {
        first_name: Joi.string().min(1).max(50).required(),
        last_name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(4).max(255).email().required(),
        password: Joi.string().min(4).max(32).required(),
        phone: Joi.string().min(10).max(15).required(),
        address: Joi.string().min(4).max(255).required(),
        is_admin : Joi.number().min(0).max(1).required()
    };

    return Joi.validate(user, schema);
}

async function createNewLibrarian(librarian) {
    const result = await database.query('INSERT INTO librarians SET ?', librarian);
    return result.affectedRows;
}

module.exports = {
    getLibrarianByEmail,
    validateLibrarianParams,
    createNewLibrarian
};