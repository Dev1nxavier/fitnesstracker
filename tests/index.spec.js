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
        const users = await axios.get('http://localhost:3000/api/users');//activities?

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


    it('creates a new activity', async () => {
        const data = {
            name: 'Curls',
            description: "go heavy bro!"
        };

        const res = await axios.post('http://localhost:3000/api/activities',data,
            {
                headers: {'Authorization': `Bearer ${token}`}
            
            }
        )

        expect(res.data.length!==0).toEqual(true);
    });

    it('updates an activity', async () => {
        const data = {
            name: 'DIPS',
            description: "They're horrible but great!"
        }

        const res = await axios.patch(`http://localhost:3000/api/activities/${2}`,data,
            {
                headers: {'Authorization': `Bearer ${token}`}
            
            }
        )

        expect(res.data.length!==0).toEqual(true);
    });

    it('creates a new routineActivity', async()=>{

        const data = {routineId: 2, activityId: 8, count: 20, duration: 300};

        const res = await axios.post(`http://localhost:3000/api/routine_activities`, data, 
            {
                headers: {'Authorization': `Bearer ${token}`}
            }
        );

        expect(res.data.status).toEqual('OK');
    })

    it('permanently deletes a routine activity from a routine', async ()=>{

        const data = {
            routineId: 2,
            activityId: 8,
        }

        const res = await axios.delete(`http://localhost:3000/api/routine_activities/1`,data,
            {
                headers: {'Authorization': `Bearer ${token}`},
            }
        );

        console.log(res.data.message)
        expect(res.data.message).toEqual('OK');
    });

    it('grabs all routines', async () => {
        const res = await axios.get('http://localhost:3000/api/routines');

        expect(typeof res.data.message).toEqual('string');
    })

    it('creates a routine', async () => {
        const data = {
            isPublic: false,
            name: "The Backes Pump Method",
            goal: "To get soooo jacked with minimal exogenous hormones needed"
        };

        const res = await axios.post(`http://localhost:3000/api/routines`, data,
            {
                headers: {'Authorization': `Bearer ${token}`}
            }
        );

        expect(res.data.length!==0).toEqual(true);
    });

    it('sends get request to routine_activities route', async ()=>{
        const res = await axios.get(`http://localhost:3000/api/routine_activities`);

        expect(res.data.data).toEqual('OK');
    })

    

    it('updates a routine activity', async ()=>{

        console.log('TEST PATCH ROUTINE ACTIVITIES');
        const data = {
            routineId: 1,
            activityId: 1,
            duration: Math.floor(Math.random() * 11),
            count: Math.floor(Math.random() * 11)
        }

        const res = await axios.patch(`http://localhost:3000/api/routine_activities/2`,data,
            {
                headers: {'Authorization': `Bearer ${token}`},
            }
        )

        console.log(res.data.message)
        expect(res.data.message).toEqual('OK');
    })

    it('updates a routine', async () => {
        const data = {
            isPublic: true,
            name: "Sean's Jazzersizer",
            goal: "Let's sweat to the Oldies!"
        }

        const res = await axios.patch(`http://localhost:3000/api/routines/${2}`,data,
            {
                headers: {'Authorization': `Bearer ${token}`}
            }
        )

        expect(res.data.length!==0).toEqual(true);
    })
    
})