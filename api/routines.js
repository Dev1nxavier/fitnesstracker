const express = require('express');
const routinesRouter = express.Router();
const {getPublicRoutines, createRoutine, updateRoutine, getRoutineById} = require('../db');
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

        req.send({
            message: 'new routine created',
            routine: routine,
        })
    } catch (error) {
        next(error);
    }
})

//can't just pass in creatorId in the request like we're doing. creatorId would be the creator of routine with id of routinesId and then would be matched against the current logged in user. Any thoughts on best way to get the creatorId of this routine? Should this be done in the db methods or here?
routinesRouter.patch('/:routinesId',requireUser, async (req, res, next)=>{
    const {routinesId} = req.params;
    const {isPublic, name, goal} = req.body;
    const updateFields = {};

    if(isPublic){
        updateFields.isPublic = isPublic;
    }

    if (name) {
        updateFields.name = name;
    }

    if(goal){
        updateFields.goal = goal;
    }

    console.log('Entered /routinesId PATCH, ID: ', routinesId,'To update: ', updateFields);
    
    try {
        const originalRoutine = await getRoutineById(routinesId)
        console.log('got this far')
        console.log(originalRoutine);
        
        if (originalRoutine.author.id === req.user.id) {
            console.log("permission to edit routine granted");
            const updatedRoutine = await updateRoutine(routinesId, updateFields);
            res.send({
                message: 'Routine updated',
                data: updatedRoutine
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
})

module.exports = routinesRouter;
