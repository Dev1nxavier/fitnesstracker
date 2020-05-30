const express = require('express');
const routinesRouter = express.Router();
const {  }  = require('../db');

routinesRouter.get('/', async (req, res, next)=>{
    console.log('successfully entered /routines')
})