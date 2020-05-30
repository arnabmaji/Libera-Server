const express = require('express');
const router = express.Router();
const {availableEntities, getCount, getIssuedHoldingsCount} = require('../models/statistics');
const librarianAuth = require('../middleware/librarian-auth');

// add route for getting count for each available entities
router.get('/count/:entity', librarianAuth, async (req, res) => {
    /*
    * Route for fetching count of Entities
    * Available Entities: books, holdings, authors, publishers, issues, users
     */

    let entity = req.params.entity;

    if (availableEntities.includes(entity))
        return res.status(200).send((await getCount(entity)).toString());

    if (entity === 'issues')
        return res.status(200).send((await getIssuedHoldingsCount()).toString());

    res.sendStatus(400);

});

module.exports = router;