const Joi = require('joi');
const database = require('./db');

async function addNewBook(book) {
    const res = await database.query('INSERT INTO books SET ?', book);
    return res.affectedRows;
}

async function deleteBookById(id) {
    const res = await database.query('DELETE FROM books where book_id = ?', id);
    return res.affectedRows;
}

function validateBooksParams(book) {
    const schema = {
        title: Joi.string().min(4).max(255).required(),
        author_id: Joi.number().min(1).required(),
        publisher_id: Joi.number().min(1).required(),
        year_published: Joi.number().min(1900).max(2050).required()
    };

    return Joi.validate(book, schema);
}

async function searchBooks(keyword) {
    return await database.query('SELECT * FROM book_details WHERE title REGEXP ? ',
        keyword);
}

async function getIssuedHoldings(bookId) {
    /*
    * Fetch all issued holdings for the book
     */
    const results = await database.query('SELECT\n' +
        '       holding_number\n' +
        '       FROM issue_details\n' +
        '       JOIN holdings USING (holding_number)\n' +
        '       WHERE submission_date IS NULL\n' +
        '       AND book_id = ?', bookId);

    let holdingNumbers = [];
    for (const result of results)
        holdingNumbers.push(result.holding_number);

    return holdingNumbers;
}

module.exports = {
    validateBooksParams,
    addNewBook,
    deleteBookById,
    searchBooks,
    getIssuedHoldings
};