const database = require('./db');

async function getLibrarianByEmail(email) {
    const rows = await database.query('SELECT * FROM librarians WHERE email = ?', email);
    return rows[0];
}

module.exports = {
    getLibrarianByEmail
};