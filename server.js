const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const morgan = require('morgan');

const auth = require('./routes/auth');
const books = require('./routes/books');
const holdings = require('./routes/holdings');
const users = require('./routes/users');
const issues = require('./routes/issues');
const librarians = require('./routes/librarians');
const authors = require('./routes/auhtors');

const app = express();

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey not defined.')
    process.exit(1);
}

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(delay);

// routes
app.get('/', (req, res) => {
    res.status(200).send('Libera Server is Running.');
})

// route for handling authentication
app.use('/api/auth', auth);

// route for handling all requests related to books
app.use('/api/books', books);

// route for handling all request related to holdings
app.use('/api/holdings', holdings);

// route for handling all requests related to users
app.use('/api/users', users);

// route for making issue of a book or return
app.use('/api/issues', issues);

// route for handling all requests related to librarians
app.use('/api/librarians', librarians);

// route for handling all requests related to authors
app.use('/api/authors', authors);

app.listen(process.env.PORT, () => console.log(`Listening on Port ${process.env.PORT}...`));

// **********Custom middle for delays in api calls (DEV ONLY)****************
function delay(req, res, next) {
    setTimeout(next, 3000);
}