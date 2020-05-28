const express = require('express');
const {getAllActivities} = require('../db');

const activitiesRouter = express.Router();

activitiesRouter.get('/', async(req, res, next)=>{
    res.send({message: 'entered /activities successfully'});
})


module.exports = activitiesRouter;