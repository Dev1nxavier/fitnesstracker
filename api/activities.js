const express = require('express');
const {getAllActivities, createActivity} = require('../db');
const {requireUser} = require('./utils');
const activitiesRouter = express.Router();


activitiesRouter.get('/', async(req, res, next)=>{
    res.send({message: 'entered /activities successfully'});
})

const bodyParser = require('body-parser');
activitiesRouter.use(bodyParser.json());


activitiesRouter.get('/', async(req, res) => {
    const activities = await getAllActivities();

    res.send({
        activities,
    });
});

// POST /activities (*)
activitiesRouter.post('/',requireUser, async(req, res, next) => {
    const body = req.body;

    try {
        const post = await createActivity(body);
        if (post) {
            res.send({
                post,
            });
        } else {
            next({
                name: "noActivityFoundError",
                message: "No Activity inserted!"
            })
        }
    } catch (error) {
        next(error);
    }
})

// PATCH /activities/:activityId (*)

// GET /activities/:activityId/routines

module.exports = activitiesRouter;