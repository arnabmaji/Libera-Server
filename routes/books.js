const express = require('express');
const _ = require('lodash');
const librarianAuth = require('../middleware/librarian-auth');
const {
    validateBooksParams,
    addNewBook,
    deleteBookById,
    searchBooks,
    getIssuedHoldings
} = require('../models/book');

const router = express.Router();

// add route for adding new books
router.post('/', librarianAuth, async (req, res) => {

    let book = _.pick(req.body, ['title', 'author_id', 'publisher_id', 'year_published']);
    // validate book body params
    const {error} = validateBooksParams(book);
    if (error) return res.status(400).send(error.details[0].message);

    // add new book
    let affectedRows = await addNewBook(book);
    if (affectedRows === 1) return res.sendStatus(200);
    res.sendStatus(500);
})

// add route for deleting book by its id
router.delete('/:bookId', librarianAuth, async (req, res) => {

    let affectedRows = await deleteBookById(req.params.bookId);  // delete book by its id

    if (affectedRows === 1) return res.sendStatus(200);
    res.sendStatus(400);
});

// add route for searching book by title
router.get('/search', librarianAuth, async (req, res) => {
    const results = await searchBooks(req.query.keyword);
    res.status(200).send(results);
});

// add route for fetching all issued holdings for a book
router.get('/issues/:bookId', librarianAuth, async (req, res) => {
    res.status(200).send(await getIssuedHoldings(req.params.bookId));
});

module.exports = router;