//describe 
//expect
//it


const axios = require('axios');
const faker = require('faker');
const { getUserByUsername } = require('../db'); 
// const { startDB } = require('../db/seed'); 

let user;

describe('Booleans', ()=>{
    it('is a test of the tests', async ()=>{
        expect(true === true).toEqual(true);
    });
})


describe('ActivitiesRouter', ()=>{
    it('sends a get request to /api/activities', async()=>{
        const res = await axios.get('http://localhost:3000/api/activities');

        expect(typeof res.data.message).toEqual('string');
    })
})

describe('UserRouter', ()=>{

    // beforeAll(async()=>{
    //     //initialize db
    //     await startDB();
    // })

    it('sends a get request to /api/users', async()=>{

        const res = await axios.get('http://localhost:3000/api/users');

        expect(typeof res.data.message).toEqual('string');
    })

    it('retrieves all users from user table', async()=>{
        const users = await axios.get('http://localhost:3000/api/activities');

        expect(users.length!==0).toEqual(true);
    })

    it('registers new user via post/users/register', async ()=>{

        const username = faker.internet.userName();
        const password = 'password';

        const  res = await axios.post('http://localhost:3000/api/users/register', {
            username: username,
            password: password
        });

        user = { username, password };

        expect(typeof res.data.message).toEqual('string');

    });

    it('check for matching username/ password match', async()=>{


        const res = await axios.post('http://localhost:3000/api/users/login', {
            username: user.username ,
            password: user.password
        })

        expect(typeof res.data.message).toEqual('string');

    })

})



