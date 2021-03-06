require('dotenv').config();
const {JWT_SECRET} = process.env;
const jwt = require('jsonwebtoken');
const express = require('express');
const apiRouter = express.Router();
const morgan = require('morgan');
const {getUserById} = require('../db');

apiRouter.use(async (req, res, next) => {
    console.log('Running authorization middleware...');
    const prefix = "Bearer ";
    const auth = req.header("Authorization");
    // console.log('headers: ', req.headers);
    if(!auth) {

        console.log('no authorization?');
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
        console.log('Token: ', token);
        try {
            console.log('about to retrieve id!');
            const {id} = jwt.verify(token, `${JWT_SECRET}`);
            console.log('retrieved ID from token: ', id);
            if (id) {
                req.user = await getUserById(id);
                console.log('retrieved user: ', req.user);
                next();
            }
        } catch (error) {
            next(error);
        } 
    } else {
        next({
            name: "AuthorizationHeaderError",
            message: `Authorization token must start with ${prefix}`,
        });
    }
});

apiRouter.use((req, res, next) => {
    if (req.user) {
        console.log("user is set: ", req.user);
    }

    next();
})

apiRouter.get('/', async(req, res, next)=>{
    res.send({message: 'reached /api successfully'});
    res.end();
})

const usersRouter  = require('./users');
apiRouter.use('/users', usersRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

const routine_activitiesRouter = require('./routine_activities');
apiRouter.use('/routine_activities', routine_activitiesRouter);

apiRouter.use((error, req, res, next)=>{
    res.send(error);
});

module.exports = apiRouter;