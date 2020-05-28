const express = require('express');

const { createUser, db } = require('../db');

const usersRouter = express.Router();

const bodyParser = require('body-parser');
usersRouter.use(bodyParser.json());

const bcrypt = require('bcrypt');

const SALT_COUNT = 10;

usersRouter.get('/', async (req, resp, next)=>{
    resp.send({message: "You have successfully entered users"});

    resp.end();
})

usersRouter.post('/register', async (req, resp, next)=>{

    const { username, password } = req.body;
    console.log('reached /users/register with username: ', username);

    bcrypt.hash(password, SALT_COUNT, (error, hashedPassword)=>{
    
    return createUser({username, password: hashedPassword});
} );


})

module.exports = usersRouter;