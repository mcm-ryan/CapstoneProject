const express = require('express');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const gameRouter = require('./routes/gameRouter');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

/**
 * The port on which the server is listening.
 * @type {number}
 */
const port = 3001;

const cors = require('cors');
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes

/**
 * Express application index route.
 * @type {import('express').Router}
 */
app.use('/', indexRouter);

/**
 * Express application users route.
 * @type {import('express').Router}
 */
app.use('/users', usersRouter);

/**
 * Express application game route.
 * @type {import('express').Router}
 */
app.use('/game', gameRouter);

/**
 * Starts the Express application server.
 */
app.listen(port, () => console.log('Example app is listening on port ' + port + '.' ));
