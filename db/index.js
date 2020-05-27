const { Client } = require('pg');

const db = new Client('postgres://localhost:5432/fitness-dev');

const faker = require('faker');

async function createUser({username, password}){

    try {
        const {rows: [user]} =  await db.query(`
        INSERT INTO users("username", "password") 
        VALUES($1, $2)
        RETURNING *;
        `, [username, password]);
    
        return user; 
    } catch (error) {

        throw error; 
        
    }
   
}

module.exports={createUser, db};