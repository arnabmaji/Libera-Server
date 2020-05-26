const database = require('./db');
const Joi = require('joi');

async function getPublishers() {
    return await database.query('SELECT * FROM publishers');
}

async function addPublisher(publisher) {
    /*
    * Create new Publisher in the database
     */
    const result = await database.query('INSERT INTO publishers SET ?', publisher);
    return result.affectedRows === 1;
}

function validatePublisherParams(publisher) {
    /*
    * Validate publisher params received in request body
     */

    const schema = {
        name: Joi.string().min(4).required()
    }
    return Joi.validate(publisher, schema);
}

module.exports = {
    getPublishers,
    validatePublisherParams,
    addPublisher
}