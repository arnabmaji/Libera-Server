const express = require('express');
const librarianAuth = require('../middleware/librarian-auth');
const _ = require('lodash');

const router = express.Router();
const {getPublishers, validatePublisherParams, addPublisher} = require('../models/publisher');

// add route for fetching all publishers
router.get('/', librarianAuth, async (req, res) => {
    res
        .status(200)
        .send(await getPublishers());
});

// add route for adding new publishers
router.post('/', librarianAuth, async (req, res) => {

    // retrieve publisher params from request body
    let publisher = _.pick(req.body, 'name');
    // validate params
    const {error} = validatePublisherParams(publisher);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await addPublisher(publisher);
    res.sendStatus(result ? 200 : 500);
});

module.exports = router;