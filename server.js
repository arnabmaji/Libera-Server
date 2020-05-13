const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const auth = require('./routes/auth');

const app = express();

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey not defined.')
    process.exit(1);
}

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.status(200).send('Libera Server is Running.');
})

// route for handling authentication
app.use('/api/auth', auth);


app.listen(process.env.PORT, () => console.log(`Listening on Port ${process.env.PORT}...`));