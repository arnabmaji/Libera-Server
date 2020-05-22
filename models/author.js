const database = require('./db');

async function getAuthors() {
    return await database.query('SELECT * FROM authors');
}

module.exports = {
    getAuthors
}