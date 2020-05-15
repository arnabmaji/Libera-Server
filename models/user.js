const Joi = require('joi');
const database = require('./db');

function validateUserParams(user) {

    /*
    * Method used for validating user params received ib request body
     */

    const schema = {
        first_name: Joi.string().min(1).max(50).required(),
        last_name : Joi.string().min(1).max(50).required(),
        email: Joi.string().min(4).max(255).email().required(),
        password: Joi.string().min(4).max(32).required(),
        phone : Joi.string().min(10).max(15).required(),
        address: Joi.string().min(4).max(255).required()
    };

    return Joi.validate(user, schema);
}

async function getUserByEmail(email) {
    /*
    * Get user details by email
     */

    const rows = await database.query('SELECT * FROM users where email = ? ', email);
    return rows[0];
}

async function createNewUser(user) {
    /*
    *   Create new user with given details
     */

    const result = await database.query('INSERT INTO users SET ?', user);
    return result.affectedRows;
}

module.exports = {
    validateUserParams,
    getUserByEmail,
    createNewUser
};