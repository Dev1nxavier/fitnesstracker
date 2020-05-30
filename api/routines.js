const express = require('express');
const routinesRouter = express.Router();
const {getPublicRoutines, createRoutine} = require('../db');
const {requireUser} = require('./utils');

routinesRouter.get('/', async (req, res, next) => {
    
    try {
        const routines = await getPublicRoutines();
        res.send({
            data: routines
        });
    } catch (error) {
        next(error);
    }
});

routinesRouter.post('/', requireUser, async (req, res, next) => {
    try {
        console.log("Entered /POST routines")
        // const body = {creatorId, publica, name, goal} = req.body;
        console.log(req.body);

        const routine = await createRoutine({
            creatorId,
            publica,
            name,
            goal,
        })

        req.send({
            routine,
        })
    } catch (error) {
        next(error);
    }
})

module.exports = routinesRouter;
