const express = require('express');
const librarianAuth = require('../middleware/librarian-auth');

const router = express.Router();
const {getPublishers} = require('../models/publisher');

// add route for fetching all publishers
router.get('/', librarianAuth, async (req, res) => {
    res
        .status(200)
        .send(await getPublishers());
});

module.exports = router;