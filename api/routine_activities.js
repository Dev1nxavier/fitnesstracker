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

    console.log('Entered POST /routine_activities to add activity to routine');
    const {routineId, activityId, count, duration} = req.body;
    console.log('Do we get this far?');
    const newActivity = await createRoutineActivity(routineId, activityId, count, duration);
    console.log('Do we get AGAIN THIS FAR?');
    res.send({
        message: 'Activity added to routine',
        data: newActivity,
        status: 'OK'
    })

})

routine_activitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next)=>{
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const fields = {};

    if (count) {
        fields.count = count;
    }

    if (duration) {
        fields.duration = duration;
    }

try {

    console.log('entered routineActivity PATCH')

    //get original routine_activity
    const {creatorId} = await getRoutineActivityById(routineActivityId);
    console.log('/PATCH routineActivityId: ', routineActivityId);
    console.log('creatorId: ', creatorId, 'userId: ', req.user.id);
    if (creatorId === req.user.id) {
    // if (5 === req.user.id) {
        console.log('User verified. Permission to edit');

        const routineActivity = await updateActivityToRoutine(routineActivityId, fields)

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
    const {routineActivityId}= req.params;

try {
    console.log('RoutineActivityId for deletion: ', routineActivityId);
    const {creatorId} = await getRoutineActivityById(routineActivityId);
   
    if (creatorId === req.user.id){
    // if (5 === req.user.id){
        const deleteActivity = await destroyRoutineActivity(routineActivityId);
        res.send({
            message: `activity deleted: ${deleteActivity}`,
            status: true,
        })
    }else(next({
        name: 'unauthorizedUserError',
        message: 'Police have been called and are en route'
    }))
    
} catch (error) {
    throw error;
}
    
})

module.exports = routine_activitiesRouter;

