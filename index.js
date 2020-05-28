
require('dotenv').config();

const PORT = 3000;

const { db } = require('./db');

db.connect();

const express = require('express');

const server = express();

const morgan = require('morgan');

const bodyParser = require('body-parser');
server.use(morgan('dev')); //use morgan in development environment only

const apiRouter = require ('./api');
server.use('/api', apiRouter);

server.listen(PORT, ()=>{
    console.log('listening on port: ', PORT);
})

