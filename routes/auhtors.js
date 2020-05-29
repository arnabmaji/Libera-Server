const express = require('express');
const _ = require('lodash');
const librarianAuth = require('../middleware/librarian-auth');
const {getAuthors, validateAuthorParams, addAuthor} = require('../models/author');

const router = express.Router();

// route for fetching all authors
router.get('/', librarianAuth, async (req, res) => {
    res
        .status(200)
        .send(await getAuthors());
});

// add route for creating new authors
router.post('/', librarianAuth, async (req, res) => {
    /*
    * Retrieve Params from body
    * Send error if any
    * Proceed to create new author
     */

    let author = _.pick(req.body, ['first_name', 'last_name']);

    const {error} = validateAuthorParams(author);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await addAuthor(author);
    res.sendStatus(result ? 200 : 500);
});

module.exports = router;