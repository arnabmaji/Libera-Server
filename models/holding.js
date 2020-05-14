const database = require('./db');

async function addNewHolding(book) {
    const result = await database.query('INSERT INTO holdings SET ?', book);
    return result.insertId;
}

module.exports = {
    addNewHolding
};