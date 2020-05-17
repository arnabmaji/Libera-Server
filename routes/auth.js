const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { getLibrarianByEmail } = require('../models/librarian');
const { getUserByEmail } = require('../models/user');

const router = express.Router();

// route for authenticating librarians
router.post('/librarian', async (req, res) => {

    // validate request body
    const { error } = validateAuthCredentials(_.pick(req.body, [ 'email', 'password']));
    if (error) return res.status(401).send(error.details[0].message);

    // verify authentication details
    const librarian = await getLibrarianByEmail(req.body.email);
    // if email is not found, send error message
    if (!librarian) return res.status(400).send('Invalid email or password');
    // verify password
    let valid = await bcrypt.compare(req.body.password  , librarian.password);
    if (!valid) return res.status(400).send('Invalid email or password');

    // if user is authenticated send auth token
    res
        .header('x-auth-token', generateAuthToken(librarian))
        .sendStatus(200);

});

// add route for authenticating users
router.post('/user', async (req, res) => {

    // validate request body
    const {error} = validateAuthCredentials(_.pick(req.body, ['email', 'password']));
    if (error) return res.status(400).send(error.details[0].message);

    // verify authentication details
    let user = await getUserByEmail(req.body.email);
    // if user is not found
    if (!user) return res.status(400).send('Invalid email or password.');
    // verify password
    let valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).send('Invalid email or password.');

    // if user is authenticated, send auth token with user information
    res
        .header('x-auth-token', generateAuthToken(user))
        .status(200)
        .send(_.pick(user, ['first_name', 'last_name', 'email', 'phone', 'address']));

})

function validateAuthCredentials(user) {
    const schema = {
        email: Joi.string().min(4).max(255).email().required(),
        password: Joi.string().min(4).max(32).required()
    }

    return Joi.validate(user, schema);
}

function generateAuthToken(user) {
    return jwt.sign(_.pick(user, ['first_name', 'last_name', 'email', 'is_admin']), config.get('jwtPrivateKey'));
}

module.exports = router;