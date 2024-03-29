const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const {getLibrarianByEmail} = require('../models/librarian');
const {getUserByEmail} = require('../models/user');
const Roles = require('../models/roles');

const router = express.Router();

// route for authenticating librarians
router.post('/librarian', async (req, res) => {
    /*
    * Retrieve Auth credentials from body
    * Validate them, send error if any
    * Verify auth credentials
    * Generate Auth Token
    * Send auth token in response header
     */

    const {error} = validateAuthCredentials(_.pick(req.body, ['email', 'password']));
    if (error) return res.status(401).send(error.details[0].message);

    const librarian = await getLibrarianByEmail(req.body.email);
    if (!librarian) return res.status(400).send('Invalid email or password');

    let valid = await bcrypt.compare(req.body.password, librarian.password);
    if (!valid) return res.status(400).send('Invalid email or password');

    let tokenParams = {
        id: librarian.librarian_id,
        email: librarian.email,
        role: librarian.is_admin ? Roles.ADMIN : Roles.LIBRARIAN
    };
    const authToken = generateAuthToken(tokenParams);

    res
        .header('x-auth-token', authToken)
        .status(200)
        .send(_.pick(librarian, ['first_name', 'last_name', 'email']));

});

// add route for authenticating users
router.post('/user', async (req, res) => {
    /*
    * Retrieve Auth credentials from body
    * Validate them, send error if any
    * Verify auth credentials
    * Generate Auth Token
    * Send auth token in response header
     */

    const {error} = validateAuthCredentials(_.pick(req.body, ['email', 'password']));
    if (error) return res.status(400).send(error.details[0].message);

    let user = await getUserByEmail(req.body.email);
    if (!user) return res.status(400).send('Invalid email or password.');

    let valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).send('Invalid email or password.');

    let tokenParams = {
        id: user.user_id,
        email: user.email,
        role: Roles.USER
    }
    const authToken = generateAuthToken(tokenParams);

    res
        .header('x-auth-token', authToken)
        .status(200)
        .send(_.pick(user, ['first_name', 'last_name', 'email']));

})

function validateAuthCredentials(user) {
    const schema = {
        email: Joi.string().min(4).max(255).email().required(),
        password: Joi.string().min(4).max(32).required()
    }

    return Joi.validate(user, schema);
}

function generateAuthToken(tokenParams) {
    return jwt.sign(tokenParams, config.get('jwtPrivateKey'));
}

module.exports = router;