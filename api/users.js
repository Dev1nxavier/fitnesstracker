const express = require('express');

const { createUser, db } = require('../db');

const usersRouter = express.Router();

const bodyParser = require('body-parser');
usersRouter.use(bodyParser.json());

const bcrypt = require('bcrypt');

const SALT_COUNT = 10;

usersRouter.get('/', async(req, res, next)=>{
    res.send({message: 'reached /api/users successfully'});
})

usersRouter.post('/register', async (req, resp, next)=>{

    try {
        const { username, password } = req.body;
    console.log('reached /users/register with username: ', username);

    bcrypt.hash(password, SALT_COUNT, (error, hashedPassword)=>{
    
    return createUser({username, password: hashedPassword});
} );
    } catch (error) {
        
        throw error;
    }
    


})

module.exports = usersRouter;