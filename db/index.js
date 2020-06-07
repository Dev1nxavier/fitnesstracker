const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/fitness-dev'
const db = new Client(connectionString);

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

async function getUserByUsername(username) {

    try {

    const { rows: [user] } = await db.query(`
      SELECT *
      FROM users
      WHERE username=$1
    `, [username]);
    


    return user;

    } catch (error) {
        throw error;
    }
    
}

async function getUserById(Id) {

    try {
        const {rows: [user]} = await db.query(`
            SELECT * 
            FROM users
            WHERE id = $1;
        `, [Id]);

        return user;
    } catch (error) {
        throw error
    }
}

async function createActivity({name, description}) {
    console.log('entering createActivity');

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

async function getAllActivities() {
    try {
        const {rows: activities} = await db.query(`
            SELECT *
            FROM activities;
        `);

        return activities;
    } catch (error) {
        throw error;
    }
}

async function createRoutine({creatorId, isPublic, name, goal}) {
    console.log("Entering createRoutine");

    try {
        const {rows: [routine]} = await db.query(`
            INSERT INTO routines ("creatorId", "public", "name", "goal")
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, isPublic, name, goal]);

        console.log("Your new routine: ", routine);
        return routine;
    } catch (error) {
        throw error;
    }
}

//not working. failing on sql query? Why?
async function updateRoutine(routinesId, fields ={}) {
    const { setString, queryString } = setStringFunction(fields);
    console.log('Entered updateRoutine in db');
    console.log('routinesId: ', routinesId);
    console.log('fields: ', fields);
    console.log('setString: ', setString);
    console.log('queryString: ', queryString);

    try {
        console.log('trying to update routine...');

        const { rows: [routine] } =await db.query(`
            UPDATE routines
            SET ${ setString }
            WHERE id=${ routinesId}
            RETURNING *;
        `, queryString);
        
        console.log('Routine updated: ', routine);

        return routine;
    } catch (error) {
        throw error;
    }
}

async function getAllRoutines() {

    try {
        const {rows: routineIds} = await db.query(`
            SELECT id
            FROM routines;
        `);

        const routines = await Promise.all(
            routineIds.map((routine) => getRoutineById(routine.id))
        );

        return routines;
    } catch (error) {
        throw error;
    }
}

async function getPublicRoutines() {
    try {
        const {rows: routineIds} = await db.query(`
            SELECT id
            FROM routines
            WHERE public =true;
        `);

        console.log('Entered getPublicRoutines.routineIds:',routineIds);
        const routines = await Promise.all(
            routineIds.map((routine) => getRoutineById(routine.id))
        );
        
        return routines;
    } catch (error) {
        throw error;
    }
}

//why was username originally de-structured from object?
async function getAllRoutinesByUser(username) {
    console.log("Entering getAllRoutinesByUser")
    
    try {
        const {id} = await getUserByUsername(username);
        console.log('User ID: ', id);
        const {rows: routineIds} = await db.query(`
            SELECT id
            FROM routines
            WHERE "creatorId"=${id};
        `)

        const routines = await Promise.all(
            routineIds.map((routine) => getRoutineById(routine.id))
        );

        return routines;
    } catch (error) {
        throw error;
    }
}

async function getPublicRoutinesByUser(username) {
    const {id} = getUserByUsername(username);

    try {
        const {rows: routineIds} = await db.query(`
            SELECT id
            FROM routines
            WHERE "creatorId"=${id} AND public =true;
        `)

        const routines = await Promise.all(
            routineIds.map((routine) => getRoutineById(routine.id))
        );

        return routines;
    } catch (error) {
        throw error;
    }
}


async function getPublicRoutinesByActivity(activityString) {
    try {
        const {rows: [routines]} = await db.query(`
        SELECT * FROM routines 
        JOIN routine_activities ON routines.id=routine_activities."routineId"
        JOIN activities ON routine_activities."activityId"=activities.id
        WHERE activities.name LIKE $1 AND routines.public=true;
    `, [activityString]);

    console.log('Your routines with activity: ', activityString, ': ', routines);

    return routines; 
    } catch (error) {
        throw error;
    }
   
}

async function getPublicRoutinesByActivityId(activityId) {

    console.log('Entered getPublicRoutinesByActivityId, activityId: ', activityId);
    try {
        const { rows: [routines] } = await db.query(`
        SELECT * FROM routines 
        JOIN routines_activities ON routines.id=routine_activities."routineId"
        WHERE routine_activities."routineId"=$1 AND routines.public=true;
        `, [activityId]);

        console.log('Exiting with routines: ', routines);

        return routines;

    } catch (error) {
        
    }
}

async function getRoutineById(routineId) {
    try {
        const { rows: [ routine ] } = await db.query(`
            SELECT * 
            FROM routines
            WHERE id = $1;
        `, [routineId]);

        //CHECK FUNCTION: SELECT * OR SELECT activities.* ??
        const { rows: activities } = await db.query(`
            SELECT *
            FROM activities
            JOIN routine_activities ON activities.id=routine_activities."activityId"
            WHERE routine_activities."routineId"=$1;
        `, [routineId]);

        const { rows: [author] } = await db.query(`
            SELECT id, username
            FROM users
            WHERE id=$1;
        `, [routine.creatorId]);

        routine.activities = activities;
        routine.author = author;
        console.log('routines: ', routine);
        return routine;
    } catch (error) {
        throw error;
    }
}

async function destroyRoutineActivity(routineActivityId) {
    console.log('Entered destroyRoutineActivity');

    try {
        const {rows: [activity]} = await db.query(`
        DELETE FROM routine_activities
        WHERE id=$1;
    `, [routineActivityId]);

    console.log('Activity deleted!');
    return activity;
    } catch (error) {
        throw error;
    }
}

async function destroyRoutine(id) {
    console.log('Entered destroyRoutine');

    try {
        
        const {rows: [activity]} = await db.query(`
            DELETE FROM routine_activities
            WHERE "routineId" = ${id};
        `);

        const {rows: [routine]} = await db.query(`
            DELETE FROM routines
            WHERE id = ${id};
        `);

        console.log('Routine deleted: ', routine);
        return routine;
    } catch (error) {
        throw error;
    }
}

//helper stringify function 
function setStringFunction(fields) {

    const setString = Object.keys(fields).map((key, index)=>{
       return  `"${key}" = $${index+1}`}).join(', ');


    if (setString.length === 0) {
        return; 
    }

    const queryString = Object.values(fields);

    const newFields = {setString, queryString};
    return newFields;
}


async function createRoutineActivity(routineId, activityId, count=4, duration=4) {
        console.log('Entered createRoutineActivity in db. Params: ', routineId, activityId, count, duration );
    try {
        
        const { rows }= await db.query(`
            INSERT INTO routine_activities("routineId", "activityId", "duration", "count" )
            VALUES($1, $2, $3, $4)
            ON CONFLICT("routineId", "activityId") DO NOTHING
            returning *;
        `, [routineId, activityId, count, duration]);

        console.log('Exiting CreateRoutineActivity successfully: ', rows);

        return rows;

    } catch (error) {
        throw error;
    }
}

async function getRoutineActivityById(routineActivityId) {
    const activityIdNum = Number(routineActivityId);
        console.log('Entered getRoutineActivityById')
        console.log('/db routineActivityID: ', activityIdNum)
    try {

        const { rows: [routineActivity] } = await db.query(`
            SELECT * 
            FROM routine_activities
            JOIN routines ON "routineId" = routines.id
            WHERE routine_activities.id=$1;
        `, [activityIdNum]);

        console.log('Exiting getRoutineActivityById successfully. Retrieved Routine: ', routineActivity);
        return routineActivity;
        
    } catch (error) {
        throw error; 
    }
}


async function addActivityToRoutine(routineId, activityList) {

    try {
        const createRoutineActivityPromises = activityList.map(async activity=>{

            return await createRoutineActivity(routineId,activity.id,4, 4)
        });

       const promise = await Promise.all(createRoutineActivityPromises);

        return await getRoutineById(routineId); 

     

    } catch (error) {
        throw error;
    }
}

async function updateActivityToRoutine(id, fields={}) {
    const { setString, queryString } = setStringFunction(fields);

    try {

        const { rows: [routineActivity] } = await db.query(`
        UPDATE routine_activities
        SET ${setString}
        WHERE "id" = ${id}
        RETURNING *;
    `,queryString);


        return routineActivity;
        
    } catch (error) {
        throw error;
    }
    
}

//was only grabbing one routine. getAllRoutinesByUser & getPublicRoutinesByUser already did this.
async function getRoutineByUsername(username) {
    console.log('Entered getRoutineByUsername db with username:', username);

    const { rows:[routines] } = await db.query(`
        SELECT * FROM routines
        JOIN users ON routines."creatorId"=users.id
        WHERE users.username=$1;
    `,[username]);

    console.log('Successfully retrieved routines:', routines);

    return routines;
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
    getUserById,
    getRoutineById,
    destroyRoutine,
    getRoutineActivityById,
    getPublicRoutinesByActivity,
    getRoutineByUsername,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivityId
};