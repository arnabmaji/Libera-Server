const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const librarianAuth = require('../middleware/librarian-auth');
const {addNewHoldings, removeHolding} = require('../models/holding');

const router = express.Router();

// add route for adding new holdings
router.post('/', librarianAuth, async (req, res) => {
    /*
    * Retrieve Params from body
    * Send error if any
    * Proceed to add new Holdings
    * return all generated holding to client
     */

    const {error} = Joi.validate(req.body, {
        book_id: Joi.number().min(1).required(),
        items: Joi.number().min(1).required()
    });
    if (error) return res.status(400).send(error.details[0].message);

    const holdingNumbers = await addNewHoldings(_.pick(req.body, 'book_id'), req.body.items);
    res.status(200).send(holdingNumbers);
});

// add route for deleting existing holdings
router.delete('/:holdingNumber', librarianAuth, async (req, res) => {
    let affectedRows = await removeHolding(req.params.holdingNumber);
    if (affectedRows === 1) return res.sendStatus(200);
    res.sendStatus(400);

});

module.exports = router;