require('dotenv').config();

const express = require('express');

const apiRouter = express.Router();

const morgan = require('morgan');

const usersRouter  = require('./users');
apiRouter.use('/users', usersRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

apiRouter.use((error, req, res, next)=>{
    res.send(error);
});

module.exports = apiRouter;