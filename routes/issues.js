const express = require('express');
const auth = require('../middleware/auth');
const _ = require('lodash');
const {validateIssueParams, makeIssues, returnHolding, getAllIssuedHoldings, getIssuedBooksByUserId} = require('../models/issue');

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

// add route for returning issued books
router.put('/:holdingNumber', auth, async (req, res) => {
    const result = await returnHolding(req.params.holdingNumber);
    res.sendStatus(result ? 200 : 400);
});

// add route for fetching all issued holdings
router.get('/', auth, async (req, res) => {
    const result = await getAllIssuedHoldings();
    res.status(200).send(result);
});

// fetch issued books for a particular user
router.get('/:userId', auth, async (req, res) => {
    res.status(200).send(await getIssuedBooksByUserId(req.params.userId));
});

module.exports = router;