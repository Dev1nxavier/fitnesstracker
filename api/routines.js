const express = require('express');
const routinesRouter = express.Router();
const {getPublicRoutines, createRoutine, updateRoutine} = require('../db');
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

    const {creatorId, isPublic, name, goal } = req.body;
    const { routinesId } = req.params;

    console.log('Entered /routinesId PATCH, req body: ', req.body);

    //shouldn't this be req.user.id?
    if(requireUser.user.id === creatorId){
        console.log("permission to edit routine granted");
        const updateFields = {};
        if(isPublic){
            updateFields.isPublic = true;
        }

        if (name) {
            updateFields.name = name;
        }

        if(goal){
            updateFields.goal = goal;
        }

        try {
            
            const routine = await updateRoutine(routinesId, updateFields);

            if (routine) {
                res.send({
                    message: 'updated routine. ',
                    data: routine
                });
            }else(next({
                name: "FailToUpdateRoutineError",
                message: 'What do you think you are trying to pull here? '
            }))
        
        } catch ({name, message}) {
            next({name, message});
        }
        

    }
    
    

    
})

module.exports = routinesRouter;
