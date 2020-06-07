require('dotenv').config();

const {PORT = 3000} = process.env;
const { db } = require('./db');
const cors = require('cors');
const express = require('express');
const server = express();
const morgan = require('morgan');
const apiRouter = require ('./api');

db.connect();

server.use(express.json());
server.use(morgan('dev')); //use morgan in development environment only
server.use(express.static("public"))
server.use(cors());
server.use('/api', apiRouter);

server.listen(PORT, ()=>{
    console.log('listening on port: ', PORT);
})

