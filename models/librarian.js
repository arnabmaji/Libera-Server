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
    /*
    * Creates new Librarian with given details
     */
    const result = await database.query('INSERT INTO librarians SET ?', librarian);
    return result.affectedRows;
}

async function deleteLibrarianById(id) {
    /*
    * Deletes librarian by id
     */
    const result = await database.query('DELETE FROM librarians WHERE librarian_id = ?', id);
    return result.affectedRows === 1;
}

module.exports = {
    getLibrarianByEmail,
    validateLibrarianParams,
    createNewLibrarian,
    deleteLibrarianById
};