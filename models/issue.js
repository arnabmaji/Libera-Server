const Joi = require('joi');
const database = require('./db');

function validateIssueParams(issue) {
    const schema = {
        user_id: Joi.number().min(1).required(),
        holding_numbers: Joi.array().items(Joi.number()).min(1).required()
    }

    return Joi.validate(issue, schema);
}

async function makeIssues(issue) {
    /*
    * Make issue for holdings to user
    * First create issue for user,
    * Then, for each holding add new rows in issue_details by issue_id
    * Perform all of the above operations in transaction
     */

    // start the transaction
    await database.query('START TRANSACTION');
    try {
        // create new issue for user
        let issueId = await createNewIssue(issue.user_id);
        // add all holdings for current issue
        for (const holdingNumber of issue.holding_numbers) {
            const alreadyIssued = await isAlreadyIssued(holdingNumber);
            if (alreadyIssued) throw new Error(`Holding ${holdingNumber} already issued!`);
            await database.query('INSERT INTO issue_details SET ?', {
                issue_id: issueId,
                holding_number: holdingNumber
            });
        }
        await database.query('COMMIT');  // commit the changes
        return 'Successful';
    } catch (e) {
        // in case of error roll back all changes
        await database.query('ROLLBACK');
        return e.message;
    }
}

async function createNewIssue(userId) {
    /*
    * Insert new row in issues table and return its id
     */
    const result = await database.query('INSERT INTO issues (user_id, issued_date, due_date)' +
        ' VALUES (?, CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY))', [userId]);
    if (!(result.affectedRows === 1)) throw new Error('Something went wrong');
    return result.insertId;
}

async function isAlreadyIssued(holdingNumber) {
    const result = await database.query('SELECT COUNT(*) AS count FROM issue_details ' +
        'WHERE holding_number = ? AND submission_date IS NULL', holdingNumber);
    return (result[0].count === 1);
}

async function returnHolding(holdingNumber) {
    /*
    * Make a return of previously issued holding
     */
    if (await isAlreadyIssued(holdingNumber)){
        const result = await database.query('UPDATE issue_details ' +
            'SET submission_date = CURRENT_DATE() ' +
            'WHERE holding_number = ? AND submission_date IS NULL', holdingNumber);
        if (result.affectedRows === 1) return true;
    }
    return false;
}

async function getAllIssuedHoldings() {
    /*
    * Fetch all issued holdings from the database
     */
    let holdingNumbers = [];
    const result = await database.query('SELECT holding_number ' +
        'FROM issue_details ' +
        'WHERE submission_date IS NULL');

    for (const holding of result) {
        holdingNumbers.push(holding.holding_number);
    }
    return holdingNumbers;
}

async function getIssuedBooksByUserId(id) {
    /*
    * Fetch all issued books for a particular user
     */
    return await database.query(
        'SELECT\n' +
        '        holding_number,\n' +
        '        CONCAT(title, \', \', author, \', \', publisher) AS book,\n' +
        '        due_date\n' +
        '        FROM book_details\n' +
        '        JOIN holdings USING (book_id)\n' +
        '        JOIN issue_details USING (holding_number)\n' +
        '        JOIN issues USING (issue_id)\n' +
        '        WHERE\n' +
        '        user_id = ?\n' +
        '        AND submission_date IS NULL'
        , id);
}

module.exports = {
    validateIssueParams,
    makeIssues,
    returnHolding,
    getAllIssuedHoldings,
    getIssuedBooksByUserId
};