const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Roles = require('../models/roles');
const auth = require('../middleware/auth');
const {validateUserParams, getUserByEmail, createNewUser, getAllUsers, getReadingHistory} = require('../models/user');
const {getIssuedBooksByUserId} = require('../models/issue');

const router = express.Router();

// add route for creating new user accounts
router.post('/', async (req, res) => {
    /*
    * Retrieve the user object from body
    * Validate Parameters
    * Send error messages if any
    * Check if email is already registered (Send error if true)
    * Then create new user (Hash the plain password)
     */

    let user = _.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'phone', 'address']);

    const {error} = validateUserParams(user);
    if (error) return res.status(400).send(error.details[0].message);

    const alreadyRegistered = await getUserByEmail(user.email);
    if (alreadyRegistered) return res.status(400).send('Email already registered.');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    let affectedRows = await createNewUser(user);
    if (affectedRows === 1) return res.sendStatus(200);

    res.sendStatus(500);
});

// add route for fetching all users
router.get('/', auth(Roles.ADMIN), async (req, res) => {
    /*
    * Fetch all user details from database
    * Only Admins can access this route
     */

    res.status(200).send(await getAllUsers());
});

// add route for fetching user by email
router.get('/:email', auth(Roles.ADMIN), async (req, res) => {
    /*
    * Fetch an user by their email id
    * Only Admins can access this route
     */

    const user = await getUserByEmail(req.params.email);
    if (user) return res.status(200).send(_.pick(user, ['user_id', 'first_name', 'last_name', 'email', 'phone', 'address']));
    res.sendStatus(400);
});

// add route for fetching issued books for user
router.get('/actions/issues', auth(Roles.USER), async (req, res) => {
    /*
    * Fetch Issued Books for the User
    * Action Performed by User
    * Get User Id from Decoded Auth Token
    * Send Issued Books for the User Id
     */
    res.status(200).send(await getIssuedBooksByUserId(req.user.id));

});

// add route for fetching user's reading history
router.get('/actions/history', auth(Roles.USER), async (req, res) => {
    /*
    * Fetch Reading History for authenticated User
    * Get User Id From decoded auth token
    * Fetch Reading History for the Use Id
     */
    res.status(200).send(await getReadingHistory(req.user.id));
})

module.exports = router;