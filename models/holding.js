const database = require('./db');

async function addNewHoldings(book, items) {

    /*
    *  Generate required numbers of holdings,
    *  and return generated holdings in an array
     */

    let holdingNumbers = [];
    while (items-- > 0) {
        const result = await database.query('INSERT INTO holdings SET ?', book);
        holdingNumbers.push(result.insertId);
    }
    return holdingNumbers;
}

module.exports = {
    addNewHoldings
};