//describe 
//expect
//it


const axios = require('axios');

describe('user_route', ()=>{
    it('responds to get request at /user with message "OK"', async ()=>{
       const resp = await axios.get('http://localhost:3000/api/users');

       expect(resp.data.message).toBeTruthy();

    })
})