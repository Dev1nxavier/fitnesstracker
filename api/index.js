require('dotenv').config();

const express = require('express');

const apiRouter = express.Router();

const morgan = require('morgan');

apiRouter.get('/', async(req, res, next)=>{
    res.send({message: 'reached /api successfully'});
    res.end();
})

const usersRouter  = require('./users');
apiRouter.use('/users', usersRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

apiRouter.use((error, req, res, next)=>{
    res.send(error);
});

module.exports = apiRouter;