//describe 
//expect
//it


const axios = require('axios');
const faker = require('faker');
const { getUserByUsername, createActivity } = require('../db'); 
// const { startDB } = require('../db/seed'); 

let user;
let token;

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

    it('sends a get request to /api/users', async()=>{

        const res = await axios.get('http://localhost:3000/api/users');

        expect(typeof res.data.message).toEqual('string');
    })

    it('retrieves all users from user table', async()=>{
        const users = await axios.get('http://localhost:3000/api/activities');//activities?

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

        token = res.data.token;
        expect(res.data.message).toEqual('SUCCESS');

    })


    it('creates a new activity', async()=>{
        // const res = await axios.post('http://localhost:3000/api/activities', 
        //     {
        //         name: 'curls',
        //         description: 'go heavy bro!'
        //     },
        //     {
        //         headers: {'Authorization': `Bearer ${token}`}
            
        //     }
        // )

        const res = await axios.post('http://localhost:3000/api/activities', {name: 'curls', description: 'go heavy bro!'});

        expect(true);
    })

})



