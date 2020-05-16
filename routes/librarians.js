const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
    getLibrarianByEmail,
    validateLibrarianParams,
    createNewLibrarian,
    deleteLibrarianById,
    getAllLibrarians} = require('../models/librarian')

const router = express.Router();

// add route for creating new librarians
router.post('/', [auth, admin], async (req, res) => {
    let librarian = _.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'phone', 'address', 'is_admin']);
    // validate params
    const { error } = validateLibrarianParams(librarian);
    if (error) return res.status(400).send(error.details[0].message);

    // check if email is already registered
    if(await getLibrarianByEmail(librarian.email)) return res.status(400).send('Email already registered.');

    // hash password
    const salt = await bcrypt.genSalt(10);
    librarian.password = await bcrypt.hash(librarian.password, salt);
    // otherwise, create new librarian
    const affectedRows = await createNewLibrarian(librarian);
    if (affectedRows === 1) return res.sendStatus(200);
    res.sendStatus(500);
});

// add route for deleting librarian by their id
router.delete('/:id', [auth, admin], async (req,res) => {
    if (await deleteLibrarianById(req.params.id)) return res.sendStatus(200);
    res.sendStatus(400);
});

// add route for fetching all librarians
router.get('/', [auth, admin], async (req, res) => {
    res.status(200).send(await getAllLibrarians());
});

module.exports = router;
