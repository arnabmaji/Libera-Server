const database = require('./db');
const Joi = require('joi');

async function getAuthors() {
    return await database.query('SELECT * FROM authors');
}

async function addAuthor(author) {
    /*
    * add new author in database
     */
    const result = await database.query('INSERT INTO authors SET ?', author);
    return result.affectedRows === 1;
}

function validateAuthorParams(author) {
    /*
    * Validate author params received in request body
     */

    const schema = {
        first_name: Joi.string().min(1).required(),
        last_name: Joi.string().min(1).required()
    };

    return Joi.validate(author, schema);
}

module.exports = {
    getAuthors,
    validateAuthorParams,
    addAuthor
}