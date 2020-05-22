const express = require('express');
const {getAuthors} = require('../models/author');

const router = express.Router();

// route for fetching all authors
router.get('/', async (req, res) => {
    // TODO: add auth middleware
    res
        .status(200)
        .send(await getAuthors());
});

module.exports = router;