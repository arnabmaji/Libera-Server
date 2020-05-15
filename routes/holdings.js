const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const auth = require('../middleware/auth');
const  { addNewHoldings, removeHolding } = require('../models/holding');

const router = express.Router();

// add route for adding new holdings
router.post('/', auth, async (req, res) => {
    // validate request params
    const { error } = Joi.validate(req.body, {
        book_id: Joi.number().min(1).required(),
        items: Joi.number().min(1).required()
    });

    if (error) return res.status(400).send(error.details[0].message);

    // add and get newly generated holding number for current book
    const holdingNumbers = await addNewHoldings(_.pick(req.body, 'book_id'), req.body.items);

    res.status(200).send({ holdingNumbers: holdingNumbers });  // return the newly generated holding  number
});

router.delete('/:holdingNumber', auth, async (req, res) => {

    let affectedRows = await removeHolding(req.params.holdingNumber);
    if (affectedRows === 1) return res.sendStatus(200);
    res.sendStatus(400);

});

module.exports = router;