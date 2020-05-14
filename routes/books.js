const express = require('express');
const _ = require('lodash');
const auth = require('../middleware/auth');
const {validateBooksParams, addNewBook, deleteBookById} = require('../models/book');

const router = express.Router();

// add route for adding new books
router.post('/', auth, async (req, res) => {

    let book = _.pick(req.body, ['title', 'author_id', 'publisher_id', 'edition', 'year_published']);
    // validate book body params
    const { error } = validateBooksParams(book);
    if (error) return res.status(400).send(error.details[0].message);

    // add new book
    let affectedRows =  await addNewBook(book);
    if (affectedRows === 1) return  res.sendStatus(200);
    res.sendStatus(500);
})

// add route for delete book by its id

router.delete('/:bookId', auth, async (req, res) => {

    let affectedRows = await deleteBookById(req.params.bookId);  // delete book by its id

    if (affectedRows === 1) return res.sendStatus(200);
    res.sendStatus(400);
});

module.exports = router;