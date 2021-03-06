require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { createUser, db, getUserByUsername, getAllRoutinesByUser} = require('../db');
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

    const user = bcrypt.hash(password, SALT_COUNT, async(error, hashedPassword)=>{
    
    const user = await createUser({username, password: hashedPassword});

    resp.send({message: 'new user created', user:user })
    } );
    

    } catch (error) {
        
        throw error;
    }

})

usersRouter.post('/login', async (req, res, next)=>{

    console.log('Entered POST /login');
    const { username, password } = req.body;
    
    
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply a username & password"
        });
    }

    try{
        console.log('Entering try block');
    const user = await getUserByUsername(username);
    console.log('Username:', username, 'User:', user);

    const hashedPassword = user.password;
        console.log('Password:', user.password, 'Hashed: ', hashedPassword);
    const login = bcrypt.compare(password, hashedPassword, (error, passwordMatch)=>{
          if (passwordMatch) {
            const id = user.id;
            
            const token = jwt.sign({id: id, username}, `${JWT_SECRET}`);  
            console.log('SuCCeSS!');
            res.send({message: 'SUCCESS', token, id});

        }else{
            next({name: "IncorrectLoginCredentialsError",
                message: " Username or password is incorrect"});
            }
        });
 
    }catch(error){
        next(error);
    }
})

usersRouter.post('/:username/routines', async(req, res, next)=>{
    console.log('Entered POST /:username/routines');
    const { username } = req.body;

    console.log('username: ', username);
try {
    const routines = await getAllRoutinesByUser(username);
    
    res.send({message: 'SUCCESS', routines});

    } catch (error) {
        throw error;
    }

})

module.exports = usersRouter;