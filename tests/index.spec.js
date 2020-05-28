//describe 
//expect
//it


const axios = require('axios');

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