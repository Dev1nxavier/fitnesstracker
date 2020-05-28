require('dotenv').config();

const express = require('express');

const apiRouter = express.Router();

const morgan = require('morgan');

const usersRouter  = require('./users');
apiRouter.use('/users', usersRouter);




apiRouter.use((error, req, res, next)=>{
    res.send(error);
});

module.exports = apiRouter;