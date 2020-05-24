const database = require('./db');

async function getPublishers() {
    return await database.query('SELECT * FROM publishers');
}

module.exports = {
    getPublishers
}