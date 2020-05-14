const Joi = require('joi');
const database = require('./db');

async function addNewBook(book) {
    const res = await database.query('INSERT INTO books SET ?', book);
    return res.affectedRows;
}

function validateBooksParams(book) {
    const schema = {
        title: Joi.string().min(4).max(255).required(),
        author_id: Joi.number().min(1).required(),
        publisher_id: Joi.number().min(1).required(),
        edition: Joi.number().min(1).required(),
        year_published: Joi.number().min(1900).max(2050).required()
    };

    return Joi.validate(book, schema);
}

module.exports = {
    validateBooksParams,
    addNewBook
};