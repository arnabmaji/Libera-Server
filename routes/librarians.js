const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Roles = require('../models/roles');
const auth = require('../middleware/auth');
const {
    getLibrarianByEmail,
    validateLibrarianParams,
    createNewLibrarian,
    deleteLibrarianById,
    getAllLibrarians
} = require('../models/librarian')

const router = express.Router();

// add route for creating new librarians
router.post('/', auth(Roles.ADMIN), async (req, res) => {
    /*
    * Retrieve librarian params from body
    * Validate them
    * Send error message if any
    * Check if email is already registered (send error if true)
    * Hash plain password
    * Proceed to create new librarian
    * Privilege: Admins Only
     */

    let librarian = _.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'phone', 'address', 'is_admin']);

    const {error} = validateLibrarianParams(librarian);
    if (error) return res.status(400).send(error.details[0].message);

    if (await getLibrarianByEmail(librarian.email)) return res.status(400).send('Email already registered.');

    const salt = await bcrypt.genSalt(10);
    librarian.password = await bcrypt.hash(librarian.password, salt);

    const affectedRows = await createNewLibrarian(librarian);
    if (affectedRows === 1) return res.sendStatus(200);
    res.sendStatus(500);
});

// add route for deleting librarian by their id
router.delete('/:id', auth(Roles.ADMIN), async (req, res) => {
    /*
    * Delete an librarian by their id
    * Privilege: Admins Only
     */

    if (await deleteLibrarianById(req.params.id)) return res.sendStatus(200);
    res.sendStatus(400);
});

// add route for fetching all librarians
router.get('/', auth(Roles.ADMIN), async (req, res) => {
    /*
    * Fetch all librarian details
    * Privilege: Admins Only
     */
    res.status(200).send(await getAllLibrarians());
});

module.exports = router;
