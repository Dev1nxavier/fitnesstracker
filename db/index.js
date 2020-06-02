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
    try {
        const {rows: [activity ]} = await db.query(`
            INSERT INTO activities("name", "description")
            VALUES($1, $2)
            RETURNING *;
        `, [name.toLowerCase(), description]); //laziest way to do this. Best way?

        console.log('name: ', name, 'description: ', description);
        console.log(activity);

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

//works but can't figure out how to get name toLowerCase
async function updateActivity(fields = {}) {    
    const {id} = fields;
    delete fields.id;
    // fields.name.toLowerCase();

    const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

    if (setString.length === 0) {
        return;
    }

    console.log('Entered updateActivity')
    console.log('params: ', id, Object.values(fields));

    try {
        const {rows} = await db.query(`
            UPDATE activities
            SET ${setString}
            WHERE id=${id}
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
        const {rows} = await db.query(`
            SELECT *
            FROM routines
        `);

        console.log('Your routines: ', rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getPublicRoutines() {
    console.log("Entering get public routines");

    try {
        const {rows: [routines]} = await db.query(`
            SELECT *
            FROM routines
            WHERE public =true;
        `);

        console.log('Your public routines: ', routines);
        return routines;
    } catch (error) {
        throw error;
    }
}

async function createRoutine({creatorId, publica, name, goal}) {
    console.log("Entering createRoutine");

    try {
        const {rows} = await db.query(`
            INSERT INTO routines ("creatorId", "public", "name", "goal")
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, publica, name, goal]);

        console.log("Your new routine: ", rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

//helper stringify function 
function setStringFunction(fields) {

    const setString = Object.keys(fields).map((key, index)=>{
       return  `"${key}" = $${index+1}`}).join(', ');

    console.log('stringFields: ',setString);

    if (setString.length === 0) {
        return; 
    }

    const queryString = Object.values(fields);

    const newFields = {setString, queryString};
    return newFields;
}

async function updateRoutine(routineId, fields ={}) {

    console.log('Entered updateRoutine in db');

    const { setString, queryString } = setStringFunction(fields);


    const {rows} = await db.query(`
        UPDATE routines
        SET (${setString})
        WHERE id = ${routineId};
    `, [queryString]);

    console.log('Exiting UpdateRoutine in db');

    return rows;
}

async function createRoutineActivity(routineId, activityId, count=4, duration=4) {

    console.log('Entered createRoutineActivity');

    try {
        
        const { rows }= await db.query(`
            INSERT INTO routine_activities("routineId", "activityId", "duration", "count" )
            VALUES($1, $2, $3, $4)
            ON CONFLICT("routineId", "activityId") DO NOTHING
            returning *;
        `, [routineId, activityId, count, duration]);

        console.log("Exiting createRoutineActivity successfully");

        return rows;

    } catch (error) {
        throw error;
    }
}

async function getRoutineById(routineId) {
    try {
        const { rows: [ routine ] } = await db.query(`
            SELECT * FROM routines
            WHERE id = $1;
        `, [routineId]);

        //CHECK FUNCTION: SELECT * ORR SELECT activities.* ??
        const { rows: activities } = await db.query(`
            SELECT *
            FROM activities
            JOIN routine_activities ON activities.id=routine_activities."routineId"
            WHERE routine_activities."routineId"=$1;
        `, [routineId]);

        const { rows: [author] } = await db.query(`
            SELECT id, username
            FROM users
            WHERE id=$1;
        `, [routine.creatorId]);

        routine.activities = activities;
        routine.author = author;

        return routine;

    } catch (error) {
        throw error;
    }
}

async function addActivityToRoutine(routineId, activityList) {

    console.log('entered addActivityToRoutine', activityList);
    try {
        const createRoutineActivityPromises = activityList.map(async activity=>{

            return await createRoutineActivity(routineId,activity.id,4, 4)
        });

       const promise = await Promise.all(createRoutineActivityPromises);
        console.log('Promises Promises... ',promise);

        return await getRoutineById(routineId); 

     

    } catch (error) {
        throw error;
    }
}

async function updateActivityToRoutine(id, fields={}) {
    console.log('Entered updateRoutineActivity');
    const { setString, queryString } = setStringFunction(fields);

    console.log(setString);
    console.log(queryString);
    try {
        console.log('Updating routine activity...');

        const { rows: [routineActivity] } = await db.query(`
        UPDATE routine_activities
        SET ${setString}
        WHERE "id" = ${id}
        RETURNING *;
    `,queryString);

        console.log('routine activity updated!', routineActivity);

        return routineActivity;
        
    } catch (error) {
        throw error;
    }
    
}

async function destroyRoutineActivity(id) {
    
    console.log('Entered destroyRoutineActivity');
    try {
        const {rows: [activity]} = await db.query(`
        DELETE FROM routine_activities
        WHERE id = ${id};
    `)
        return activity;

    console.log('Activity deleted!');
    } catch (error) {
        throw error;
    }
    
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
    updateActivityToRoutine,
    addActivityToRoutine,
    destroyRoutineActivity,
    createRoutineActivity,
};