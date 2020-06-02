const { Client } = require('pg');
const db = new Client('postgres://localhost:5432/fitness-dev');

async function createUser({username, password}){

    try {


        const {rows: [user]} =  await db.query(`
        INSERT INTO users("username", "password") 
        VALUES($1, $2)
        RETURNING *;
        `, [username, password]);
        
        console.log('user: ', username, 'password: ', password);

        return user; 
    } catch (error) {

        throw error; 
        
    }
}

async function getUserByUsername(username) {

    console.log('retrieving user info by username: ', username);

    try {
        console.log('querying users db for user...');

    const { rows: [user] } = await db.query(`
      SELECT *
      FROM users
      WHERE username=$1
    `, [username]);
    
    console.log('users db queried!');

    console.log('username: ', user.username, 'password: ', user.password);

    return user;

    } catch (error) {
        throw error;
    }
    
}

async function getUserById(Id) {
    console.log('entered getUserById');

    try {
        const {rows: [user]} = await db.query(`
            SELECT * FROM users
            WHERE id = $1;
        `, [Id]);
        console.log('retrieved user: ', user);

        return user;
    } catch (error) {
        throw error
    }
}

async function createActivity({name, description}) {
    console.log('entering createActivity');

    try {
        const {rows} = await db.query(`
            INSERT INTO activities("name", "description")
            VALUES($1, $2)
            RETURNING *;
        `, [name.toLowerCase(), description]); //laziest way to do this. Best way?

        console.log('name: ', name, 'description: ', description);
        console.log(rows);

        return rows;
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

async function updateActivity(activityId, fields = {}) {    

    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

    if (setString.length === 0) {
        return;
    }

    console.log('Entered updateActivity')
    console.log('params: ', activityId, Object.values(fields));

    try {
        const {rows} = await db.query(`
            UPDATE activities
            SET ${setString}
            WHERE id=${activityId}
            RETURNING *;
        `, Object.values(fields));

        return rows;
    } catch (error) {
        throw error;
    }
}

async function getAllRoutines() {
    console.log("Entering get all routines");

    try {
        const {rows: routineIds} = await db.query(`
            SELECT id
            FROM routines
        `);

        const routines = await Promise.all(
            routineIds.map((routine) => getRoutineById(routine.id))
        );

        console.log('Your routines: ', routines);
        return routines;
    } catch (error) {
        throw error;
    }
}

async function getPublicRoutines() {
    console.log("Entering get public routines");
    try {
        const {rows: routineIds} = await db.query(`
            SELECT id
            FROM routines
            WHERE public =true;
        `);

        const routines = await Promise.all(
            routineIds.map((routine) => getRoutineById(routine.id))
        );

        console.log('Your public routines: ', routines);
        return routines;
    } catch (error) {
        throw error;
    }
}

// getAllRoutinesByUser
// select and return an array of all routines made by user, include their activities
//important point: must include the activities associated with the routine.
//not even close: needs to be similar to post/tag relationship
async function getAllRoutinesByUser({username}) {
    console.log("Entering getAllRoutinesByUser")
    const {id} = getUserByUsername(username);
    console.log('User ID: ', id);

    try {
        const {rows: routineIds} = await db.query(`
            SELECT id
            FROM routines
            WHERE "creatorId"=${id};
        `)

        const routines = await Promise.all(
            routineIds.map((routine) => getRoutineById(routine.id))
        );

        console.log("your routines by User: ", routines);
        return routines;
    } catch (error) {
        throw error;
    }
}

// getPublicRoutinesByUser
// select and return an array of public routines made by user, include their activities
//important point: must include the activities associated with the routine.
async function getPublicRoutinesByUser({username}) {
    console.log("Entering getPublicRoutinesByUser")
    const {id} = getUserByUsername(username);
    console.log('User ID: ', id);

    try {
        const {rows: routineIds} = await db.query(`
            SELECT id
            FROM routines
            WHERE "creatorId"=${id} AND public =true;
        `)

        const routines = await Promise.all(
            routineIds.map((routine) => getRoutineById(routine.id))
        );

        console.log("your public routines by User: ", routines);
        return routines;
    } catch (error) {
        throw error;
    }
}

// getPublicRoutinesByActivity
// select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities
//important point: must include the activities associated with the routine.
//pending routine_activities
// async function getPublicRoutinesByActivity({ activityId }) {

// }

async function getRoutineById(routineId) {
    try {
        const { rows: [ routine ] } = await db.query(`
            SELECT * 
            FROM routines
            WHERE id = $1;
        `, [routineId]);

        console.log('routines still works 1')
        //CHECK FUNCTION: SELECT * ORR SELECT activities.* ??
        const { rows: activities } = await db.query(`
            SELECT *
            FROM activities
            JOIN routine_activities ON activities.id=routine_activities.“routineId”
            WHERE routine_activities.“routineId”=$1;
        `, [routineId]);

        console.log('routines still works 2')
        const { rows: [author] } = await db.query(`
            SELECT id, username
            FROM users
            WHERE id=$1;
        `, [routine.creatorId]);

        console.log('routines still works 3')
        routine.activities = activities;
        routine.author = author;
        console.log('routine: ', routine);
        return routine;
    } catch (error) {
        throw error;
    }
}

async function createRoutine({creatorId, isPublic, name, goal}) {
    console.log("Entering createRoutine");

    try {
        const {rows} = await db.query(`
            INSERT INTO routines ("creatorId", "public", "name", "goal")
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, isPublic, name, goal]);

        console.log("Your new routine: ", rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function updateRoutine(routinesId, fields ={}) {

    console.log('Entered updateRoutine in db');

    const { setString, queryString } = setStringFunction(fields);


    const {rows} = await db.query(`
        UPDATE routines
        SET (${setString})
        WHERE id = ${routinesId};
    `, [queryString]);

    console.log('Exiting UpdateRoutine in db');

    return rows;
}

async function destroyRoutineActivity(id) {
    console.log('Entered destroyRoutineActivity');

    try {
        const {rows: [activity]} = await db.query(`
        DELETE FROM routine_activities
        WHERE id = ${id};
    `)

    console.log('Activity deleted!');
    return activity;
    } catch (error) {
        throw error;
    }
}

//helper stringify function 
function setStringFunction(fields) {
    const stringFields = Object.keys(fields).map((key, index)=>{
         `"${key}" = $${index+1}`
    }).join(', ');

    if (stringFields.length === 0) {
        return; 
    }

    const queryString = Object.values(fields);

    const newFields = {stringFields, queryString};
    return newFields;
}

module.exports={
    db,
    createUser,
    getUserByUsername,
    getUserById,
    createActivity,
    getAllActivities,
    updateActivity,
    createRoutine,
    getAllRoutines,
    getPublicRoutines,
    updateRoutine,
    getUserById,
    getRoutineById,
};