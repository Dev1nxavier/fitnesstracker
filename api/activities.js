const express = require('express');
const {getAllActivities} = require('../db');

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

// PATCH /activities/:activityId (*)

// GET /activities/:activityId/routines

module.exports = activitiesRouter;