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

    // retrieve author params from request body
    let author = _.pick(req.body, ['first_name', 'last_name']);
    // validate params
    const {error} = validateAuthorParams(author);
    if (error) return res.status(400).send(error.details[0].message);

    // create new author
    const result = await addAuthor(author);
    res.sendStatus(result ? 200 : 500);

});

module.exports = router;