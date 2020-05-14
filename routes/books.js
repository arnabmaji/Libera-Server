const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// add route for adding new books
router.post('/', auth, (req, res) => {
    console.log(req.user);
    res.sendStatus(200);
})

module.exports = router;