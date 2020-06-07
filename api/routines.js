const express = require('express');
const routinesRouter = express.Router();
const {getPublicRoutines, createRoutine, updateRoutine, getRoutineById, destroyRoutine, createRoutineActivity} = require('../db');
const {requireUser} = require('./utils');

routinesRouter.get('/', async (req, res, next) => {
    
    try {
        const routines = await getPublicRoutines();
        res.send({
            message: 'retrieved routines',
            data: routines
        });
    } catch (error) {
        next(error);
    }
});

routinesRouter.post('/', requireUser, async (req, res, next) => {
    try {
        console.log("Entered /POST routines")
        const {isPublic, name, goal} = req.body;
        console.log("Request body: ", req.body);
        const creatorId = req.user.id
        console.log("creator ID: ", creatorId)

        const routine = await createRoutine({
            creatorId,
            isPublic,
            name,
            goal,
        })
        console.log('New routine created: ',routine);

        res.send({
            message: 'new routine created',
            routine: routine,
            status: 'OK'
        })
    } catch (error) {
        next(error);
    }
})


routinesRouter.patch('/:routinesId',requireUser, async (req, res, next)=>{
    const {routinesId} = req.params;
    const {public, name, goal} = req.body;
    const updateFields = {};

    console.log('Entered /routinesId PATCH. RoutineId: ', routinesId, 'req.body: ', req.body);

    if(public){
        updateFields.public = public;
    }

    if (name) {
        updateFields.name = name;
    }

    if(goal){
        updateFields.goal = goal;
    }

    
    try {
        const originalRoutine = await getRoutineById(routinesId)
        console.log('got past getRoutineById, Original Routine: ')
        console.log(originalRoutine);
        
        if (originalRoutine.author.id === req.user.id) {
        // if (5 === req.user.id) {
            console.log("permission to edit routine granted");
            const updatedRoutine = await updateRoutine(originalRoutine.id, updateFields);
            console.log('Edited routine: ', updatedRoutine);
            res.send({
                message: 'Routine updated',
                data: updatedRoutine,
                status: true,
            });
        } else {
            next({
                name: "FailToUpdateRoutineError",
                message: 'Routine not updated. What do you think you are trying to pull here?'
            });
        }
        
        } catch ({name, message}) {
            next({name, message});
        }
});

routinesRouter.post('/:routineId/activities', async(req, res, next)=>{
    console.log('Entered POST /:routinesId/activities route');
    const {routineId} = req.params;
    

    const {activityId, count, duration} = req.body;

    try {
        const newActivity = await createRoutineActivity(routineId, activityId, count, duration);

        res.send({
            message: 'added new activity to routine',
            data: newActivity,
            status: true
        })


    } catch (error) {
        throw error;
    }
})

routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    console.log('Entered  /routinesId DELETE');

    const {routineId} = req.params;
    console.log('routineId: ', routineId);

    const originalRoutine = await getRoutineById(routineId);



    try {

        if (originalRoutine.author.id === req.user.id) {
        // if (5 === req.user.id) {
            const deleteRoutine = await destroyRoutine(routineId);
            console.log('sending response');
            res.send({
                message: `routine deleted: ${deleteRoutine}`,
                status: true,
            })
        }else(next({
            name: 'routineDeleteError',
            message: 'Error deleting routine. Guess your gonna have to do another set'
        }))
      
    } catch (error) {
        throw error;
    }
})



module.exports = routinesRouter;
