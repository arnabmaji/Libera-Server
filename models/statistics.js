const database = require('./db');

const availableEntities = ['books', 'holdings', 'authors', 'publishers', 'users'];

async function getCount(entity) {
    /*
    * Fetch count of total entities from database
     */
    const results = await database.query('SELECT COUNT(*) AS count FROM ' + entity);
    return results[0].count;
}

async function getIssuedHoldingsCount() {
    /*
    * Fetch count of all checked out holdings
     */
    const results = await database.query('SELECT COUNT(*) AS count FROM issue_details WHERE submission_date IS NULL');
    return results[0].count;
}

module.exports = {
    availableEntities,
    getCount,
    getIssuedHoldingsCount
}