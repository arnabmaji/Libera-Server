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

async function removeHolding(holdingNumber) {
    /*
    * Remove existing holding by its numbers
    * And return number of affected rows
     */

    const result = await database.query('DELETE FROM holdings WHERE holding_number = ?', holdingNumber);
    return result.affectedRows;
}

module.exports = {
    addNewHoldings,
    removeHolding
};