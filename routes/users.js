const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {validateUserParams, getUserByEmail, createNewUser, getAllUsers} = require('../models/user');

const router = express.Router();

// add route for creating new user accounts
router.post('/', async (req, res) => {
    // retrieve user object from request body
    let user = _.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'phone', 'address']);
    // validate user object
    const { error } = validateUserParams(user);
    if (error) return res.status(400).send(error.details[0].message);

    // check if email is already registered
    const alreadyRegistered = await getUserByEmail(user.email);
    if (alreadyRegistered) return res.status(400).send('Email already registered.');

    // otherwise create new user
    // hash user password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    let affectedRows = await createNewUser(user);

    if (affectedRows === 1) return  res.sendStatus(200);
    res.sendStatus(500);
});

// add route for fetching all users
router.get('/', [auth, admin], async (req, res) => {
    res.status(200).send(await getAllUsers());
});

module.exports = router;