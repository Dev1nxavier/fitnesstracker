const express = require('express');
const {getAllActivities, createActivity} = require('../db');
const activitiesRouter = express.Router();

const bodyParser = require('body-parser');
activitiesRouter.use(bodyParser.json());

activitiesRouter.use((req, res, next) => {
    console.log("A request is being made to /activities");

    next();
});

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