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
        const res = await axios.get('http://localhost:3000/api');

        expect(typeof res.data.message).toEqual('string');
    })
})