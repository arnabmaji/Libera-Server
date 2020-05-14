const express = require('express');
const Joi = require('joi');
const _ = require('lodash');
const auth = require('../middleware/auth');
const  { addNewHolding } = require('../models/holding');

const router = express.Router();

// add route for adding new holdings

router.post('/', auth, async (req, res) => {
    let book = _.pick(req.body, 'book_id');
    // validate book params
    const { error } = Joi.validate(book, {
        book_id: Joi.number().min(1).required()
    });

    if (error) return res.status(400).send(error.details[0].message);

    // add and get new holding number for current book
    const holdingNumber = await addNewHolding(book);

    res.status(200).send({ holdingNumber: holdingNumber });  // return the newly generated holding  number
});

module.exports = router;