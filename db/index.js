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

async function createActivity({name, description}) {
    try {
        const {rows: [activity]} = await db.query(`
            INSERT INTO activities(name, description)
            VALUES($1, $2)
            RETURNING *;
        `, [name, description]);

        return activity;
    } catch (error) {
        throw error;
    }
}

async function getAllActivities() {
    try {
        const {rows} = await db.query(`
            SELECT *
            FROM activities;
        `);

        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports={
    db,
    createUser,
    getAllActivities,
    createActivity,
};