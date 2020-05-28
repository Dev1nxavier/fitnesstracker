
require('dotenv').config();

const PORT = 3000;

const { db } = require('./db');

db.connect();

const cors = require('cors');

const express = require('express');

const server = express();

const morgan = require('morgan');

server.use(morgan('dev')); //use morgan in development environment only
server.use(cors());

const apiRouter = require ('./api');
server.use('/api', apiRouter);

server.listen(PORT, ()=>{
    console.log('listening on port: ', PORT);
})

