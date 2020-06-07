//describe 
//expect
//it

require('dotenv').config(); 
const axios = require('axios');
const faker = require('faker');
const {API_URL, JWT_SECRET} = process.env;
// const { startDB } = require('../db/seed');

let user;
let token;
let routine;
let routineActivity;

// beforeAll( async ()=>{
//    const seed = await startDB();
// })

describe('Booleans', ()=>{
    it('is a test of the tests', async ()=>{
        expect(true === true).toEqual(true);
    });
})


describe('Test all routers', ()=>{

    describe('Users Router', ()=>{
        it('sends a get request to /api/users', async()=>{

            const res = await axios.get(`${API_URL}/api/users`);
    
            expect(typeof res.data.message).toEqual('string');
        })
    
        it('retrieves all users from user table', async()=>{
            const users = await axios.get(`${API_URL}/api/users`);//activities?
    
            expect(users.length!==0).toEqual(true);
        })
    
        it('registers new user via post/users/register', async ()=>{
    
            const username = faker.internet.userName();
            const password = 'password';
    
            const  res = await axios.post(`${API_URL}/api/users/register`, {
                username: username,
                password: password
            });
    
            user = { username, password };
    
            expect(typeof res.data.message).toEqual('string');
    
        });
    
        it('check for matching username/ password match', async()=>{
    
    
            const res = await axios.post(`${API_URL}/api/users/login`, {
                username: user.username ,
                password: user.password
            })
    
            token = res.data.token;
            expect(res.data.message).toEqual('SUCCESS');
    
        })
    })

    describe('Activities Router', ()=>{
        it('creates a new activity', async () => {
            const data = {
                name: 'Curls',
                description: "go heavy bro!"
            };
    
            const res = await axios.post(`${API_URL}/api/activities`,data,
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
    
            const res = await axios.patch(`${API_URL}/api/activities/${2}`,data,
                {
                    headers: {'Authorization': `Bearer ${token}`}
                
                }
            )
    
            expect(res.data.length!==0).toEqual(true);
        });
    

    })

    describe('routine_activities Router', ()=>{

        //I'm a little lost on this one, is this even needed? creates activity and adds to routine but seems to be broken
        // it('creates a new routineActivity', async()=>{

        //     const data = {routineId: 2, activityId: 9, count: 20, duration: 300};
    
        //     const res = await axios.post(`${API_URL}/api/routine_activities`, data, 
        //         {
        //             headers: {'Authorization': `Bearer ${token}`}
        //         }
        //     );
             
        //     routineActivity = res.data.data;
        //     console.log(routineActivity);
        //     expect(res.data.status).toEqual('OK');
        // })

        it('updates a routine activity', async ()=>{

            console.log('TEST PATCH ROUTINE ACTIVITIES');
            const data = {
                duration: Math.floor(Math.random() * 11),
                count: Math.floor(Math.random() * 11)
            }
    
            const res = await axios.patch(`${API_URL}/api/routine_activities/4`,data,
                {
                    headers: {'Authorization': `Bearer ${token}`},
                }
            )
    
            console.log(res.data.message)
            expect(res.data.message).toEqual('OK');
        })

    
        it('permanently deletes a routine activity from a routine', async ()=>{
            
            const routineActivityId = routineActivity.id;
            console.log('routineActivityId: ', routineActivityId);
    
            const data = {
                routineActivityId: routineActivity.id,
            }
    
            const res = await axios.delete(`${API_URL}/api/routine_activities/${4}`,
                {
                    headers: {'Authorization': `Bearer ${token}`},
                    data
                }
                
            );
    
            console.log(res.data.message)
            expect(res.data.status).toEqual(true);
        });

    })

    describe('Routines Router', ()=>{

        it('grabs all routines', async () => {
            const res = await axios.get(`${API_URL}/api/routines`);
    
            expect(typeof res.data.message).toEqual('string');
        })
    
        it('creates a routine', async () => {
            const data = {
                isPublic: false,
                name: "The Backes Pump Method",
                goal: "To get soooo jacked with minimal exogenous hormones needed"
            };
    
            const res = await axios.post(`${API_URL}/api/routines`, data,
                {
                    headers: {'Authorization': `Bearer ${token}`}
                }
            );
    
            routine = res.data.routine;
    
            expect(res.data.status).toEqual('OK');
        });
    
        it('sends get request to routine_activities route', async ()=>{
            const res = await axios.get(`${API_URL}/api/routine_activities`);
    
            expect(res.data.data).toEqual('OK');
        })
    
        it('updates a routine', async () => {
            const data = {
                public: true,
                name: 'Sean\'s Jazzersizer',
                goal: 'Lets sweat to the Oldies!'
            }
    
            const res = await axios.patch(`${API_URL}/api/routines/${3}`, data,
                {
                    headers: {'Authorization': `Bearer ${token}`}
                }
            )
    
            expect(res.data.status).toEqual(true);
        })
    
        it('attaches a new activity to a routine', async()=>{
    
            data={
                activityId: 7,
                count: 200,
                duration: 10
            };
    
            const res= await axios.post(`${API_URL}/api/routines/1/activities`, data, {
    
                headers: {'Authorization': `Bearer ${token}`}
    
            })
    
            expect(res.data.status).toEqual(true);
    
    
        })
    
        it('permanently deletes a routine and its activities', async () => {
            const res = await axios.delete(`${API_URL}/api/routines/${1}`,
            {
                headers: {'Authorization': `Bearer ${token}`},
            });
    
            console.log(res.data.message);
            expect(res.data.status).toEqual(true);
        })

    })
    
})