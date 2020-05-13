const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.status(200).send('Libera Server is Running.');
})

app.listen(process.env.PORT, () => console.log(`Listening on Port ${process.env.PORT}...`));