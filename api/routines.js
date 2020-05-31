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
        const body = {isPublic, name, goal} = req.body;
        const creatorId = requireUser.user.id
        console.log(body);

        const routine = await createRoutine({
            creatorId,
            isPublic,
            name,
            goal,
        })

        console.log('')
        req.send({
            message: 'new routine created',
            routine: routine,
        })
    } catch (error) {
        next(error);
    }
})

routinesRouter.patch('/:routinesId',requireUser, async (req, res, next)=>{

    const body = { id, creatorId, isPublic, name, goal } = req.body;

    console.log('Entered /routineId PATCH, req body: ', body);

    if(requireUser.user.id === creatorId){
        console.log("permission to edit routine granted");
        const { routinesId } = req.params;
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
            
            const routine = await updateRoutine(id, updateFields);

            if (routine) {
                res.send({message: 'updated routine. ',
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
