const express = require('express');
const auth = require('../middleware/auth');
const _ = require('lodash');
const {validateIssueParams, makeIssues} = require('../models/issue');

const router = express.Router();

// add route for making issue of a book
router.post('/', auth, async (req, res) => {
    // validate request body
    let issue = _.pick(req.body, ['user_id', 'holding_numbers']);
    const { error } = validateIssueParams(issue);
    if (error) return res.status(400).send(error.details[0].message);

    // create issue for the current request
    let message = await makeIssues(issue);
    if (message === 'Successful') return res.sendStatus(200);
    res.status(500).send(message);

});

module.exports = router;