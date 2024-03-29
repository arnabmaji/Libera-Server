const express = require('express');
const _ = require('lodash');
const Roles = require('../models/roles');
const auth = require('../middleware/auth');
const librarianAuth = require('../middleware/librarian-auth');
const {
    validateBooksParams,
    addNewBook,
    deleteBookById,
    searchBooks,
    getIssuedHoldings,
    getAvailableHoldings
} = require('../models/book');

const router = express.Router();

// add route for adding new books
router.post('/', librarianAuth, async (req, res) => {
    /*
    * Retrieve book params from body
    * Send error if any
    * Proceed to add new book
    * Send confirmation
     */

    let book = _.pick(req.body, ['title', 'author_id', 'publisher_id', 'year_published']);

    const {error} = validateBooksParams(book);
    if (error) return res.status(400).send(error.details[0].message);

    let affectedRows = await addNewBook(book);
    if (affectedRows === 1) return res.sendStatus(200);
    res.sendStatus(500);
})

// add route for deleting book by its id
router.delete('/:bookId', librarianAuth, async (req, res) => {

    let affectedRows = await deleteBookById(req.params.bookId);

    if (affectedRows === 1) return res.sendStatus(200);
    res.sendStatus(400);
});

// add route for searching book by title
router.get('/search', auth(Roles.ADMIN, Roles.LIBRARIAN, Roles.USER), async (req, res) => {
    const results = await searchBooks(req.query.keyword);
    res.status(200).send(results);
});

// add route for fetching all issued holdings for a book
router.get('/issues/:bookId', auth(Roles.ADMIN, Roles.LIBRARIAN, Roles.USER), async (req, res) => {
    res.status(200).send(await getIssuedHoldings(req.params.bookId));
});

// add route for fetching all available holdings for a book
router.get('/available/:bookId', auth(Roles.ADMIN, Roles.LIBRARIAN, Roles.USER), async (req, res) => {
    res.status(200).send(await getAvailableHoldings(req.params.bookId));
});

module.exports = router;