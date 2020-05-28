//describe 
//expect
//it


const axios = require('axios');
const faker = require('faker');
const { getUserByUsername } = require('../db'); 

describe('Booleans', ()=>{
    it('is a test of the tests', async ()=>{
        expect(true === true).toEqual(true);
    });
})

describe('UserRouter', ()=>{
    it('sends a get request to /api/users', async()=>{
        const res = await axios.get('http://localhost:3000/api/users');

        expect(typeof res.data.message).toEqual('string');
    })
})

describe('ActivitiesRouter', ()=>{
    it('sends a get request to /api/activities', async()=>{
        const res = await axios.get('http://localhost:3000/api/activities');

        expect(typeof res.data.message).toEqual('string');
    })
})

//get users from users table
describe('getAllUsers', ()=>{
    it('retrieves all users from user table', async()=>{
        const users = await axios.get('http://localhost:3000/api/activities');

        expect(users.length!==0).toEqual(true);
    })
})

describe('registerUserRoute', ()=>{
    it('register new user via post/users/register', async ()=>{
        jest.setTimeout(10000);

        const resp = await axios.post('http://localhost:3000/api/users/register', {
            username: 'MRT',
            password: 'pittydafool!'
        });

        expect(typeof resp.data.message).toEqual('string');

    });
})

describe('login', ()=>{
    it('check for matching username/ password match', async()=>{


        const res = await axios.post('http://localhost:3000/api/users/login', {
            username: 'MRT' ,
            password: 'pittydafool!'
        })

        expect(typeof res.data.message).toEqual('string');

    })
})

