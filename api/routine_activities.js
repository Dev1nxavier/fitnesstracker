const express = require('express');
const routine_activitiesRouter = express.Router();
// routine_activitiesRouter.use(express.json());

const bodyParser = require('body-parser');
routine_activitiesRouter.use(bodyParser.json());

const { updateActivityToRoutine, addActivityToRoutine, destroyRoutineActivity } = require('../db');

const { requireUser } = require('./utils');


routine_activitiesRouter.get('/', async(req, res, next)=>{
    console.log('Reached /routine_activities route');
    res.send({message: 'successfully reached /routine_activities route',
    data: 'OK'});
    console.log('Moving on to next route');
    next();
})

routine_activitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next)=>{

    //TODO: IF statement to ensure UserId= activity Author ID
    
    console.log('Reached /routine_activities:activity');

    const { routineActivityId } = req.params;
    console.log(req.params);
    const { routineId, count, duration } = req.body;
    console.log(req.body);
try {
    let fields = {};

    if (count) {
        fields.count = count;
    }

    if (duration) {
        fields.duration = duration;
    }

    const routineActivity = await updateActivityToRoutine(routineId, fields)

    res.send({
        message: 'OK',
    })
    } catch (error) {
        throw error;
    }

})

routine_activitiesRouter.delete('/:routineActivitesId', async (req, res, next)=>{
    //TODO: IF ensure user id matches author id
    console.log('reached DELETE /routine_activitiesId route');
    const  {routineActivitiesId } = req.params;
try {
    const { userId } = req.body
    console.log('userId: ', userId, 'activity id: ', routineActivityId);
    const deleteActivity = await destroyRoutineActivity(routineActivitiesId);
    console.log('sending response');
    res.send({
        message: `activity deleted: ${deleteActivity}`,
        status: true,
    })
} catch (error) {
    throw error;
}
    
})

module.exports = routine_activitiesRouter;

