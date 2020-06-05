const express = require('express');
const routine_activitiesRouter = express.Router();
// routine_activitiesRouter.use(express.json());

const bodyParser = require('body-parser');
routine_activitiesRouter.use(bodyParser.json());

const { updateActivityToRoutine,destroyRoutineActivity, createRoutineActivity, getRoutineActivityById } = require('../db');

const { requireUser } = require('./utils');


routine_activitiesRouter.get('/', async(req, res, next)=>{

    res.send({message: 'successfully reached /routine_activities route',
    data: 'OK'});
    next();
})

routine_activitiesRouter.post('/', requireUser, async (req, res, next)=>{
    const {routineId, activityId, count, duration} = req.body;

    const newActivity = await createRoutineActivity(routineId, activityId, count, duration);

    res.send({
        message: 'Activity added to routine',
        data: newActivity,
        status: 'OK'
    })

})

routine_activitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next)=>{

    //TODO: IF statement to ensure UserId= activity Author ID
    

    const { routineActivityId } = req.params;
    const { routineId, count, duration } = req.body;
try {
    let fields = {};

    if (count) {
        fields.count = count;
    }

    if (duration) {
        fields.duration = duration;
    }

    //get original routine_activity
    const routineActivity = await getRoutineActivityById(routineActivityId);
    if (routineActivity.creatorId = req.user.id) {
        console.log('User verified. Permission to edit');

        const routineActivity = await updateActivityToRoutine(routineId, fields)

        res.send({
            message: 'OK',
            data: routineActivity
        })
    }

    } catch (error) {
        throw error;
    }

})

routine_activitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next)=>{
    //TODO: IF ensure user id matches author id
try {
    const {routineActivityId}= req.params;
    // console.log(req.headers)

    // const { userId } = req.body

    const deleteActivity = await destroyRoutineActivity(routineActivityId);
    res.send({
        message: `activity deleted: ${deleteActivity}`,
        status: true,
    })
} catch (error) {
    throw error;
}
    
})

module.exports = routine_activitiesRouter;

