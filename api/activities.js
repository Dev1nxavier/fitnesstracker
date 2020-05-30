const express = require('express');
const {getAllActivities, createActivity, updateActivity} = require('../db');
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
activitiesRouter.post('/', requireUser, async(req, res, next) => {
    const body = req.body;
    console.log('Activity to be created: ',body);
    try {
        const activity = await createActivity({name: body.name, description: body.description});
        if (activity) {
            res.send({
                activity,
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
activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
    const {activityId} = req.params;
    const body = {name, description} = req.body;
    const updateFields = {};

    console.log("Update to be applied to Activity: ", body);

    if (name) {
        updateFields.name = name;
    }

    if (description) {
        updateFields.description = description;
    }

    try {
        const newActivity = await updateActivity({id: activityId, name, description});

        if (newActivity) {
            res.send({
                newActivity,
            })
        } else {
            next({
                name: "noNewActivityError",
                message: "Activity Not Updated!"
            })
        }
    } catch ({name, message}) {
        next({name, message});
    }
});

// GET /activities/:activityId/routines

module.exports = activitiesRouter;