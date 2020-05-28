const { db, createUser } = require('./index');

const faker = require('faker');



async function dropTables() {
    console.log('Dropping All Tables...');
    try {
        await db.query(`
        DROP TABLE IF EXISTS routine_activities;
        DROP TABLE IF EXISTS routines;
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS users;
    `)
    } catch (error) {
        throw error; 
    }
   
}

async function buildInitialDb() {
    
    try {

        console.log('building tables...');

        await db.query(`
        CREATE TABLE users(
            id  SERIAL PRIMARY KEY, 
            username VARCHAR(255) UNIQUE NOT NULL, 
            password VARCHAR(255) NOT NULL
        );
    `)

        await db.query(`
        CREATE TABLE activities(
            id SERIAL PRIMARY KEY, 
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL
        );
        `)


            //NOTE: Check creatorId references activities!!!
        await db.query(`
        CREATE TABLE routines(
            id SERIAL PRIMARY KEY, 
            "creatorId" INTEGER REFERENCES activities(id),
            public BOOLEAN DEFAULT false,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT NOT NULL
        );
        `)
            //NOTE: WILL WE GET AN ERROR BY HAVING FOREIGN KEY WITHOUT REFERENCES??
        const { rows } = await db.query(`
        CREATE TABLE routine_activities(
            id SERIAL PRIMARY KEY, 
            "routineId" INTEGER REFERENCES routines(id),
            "activityId" INTEGER REFERENCES activities(id),
            duration INTEGER,
            count INTEGER
            );
        `)

    } catch (error) {
        throw error;
    }
}
   
async function initializeUsers() {
    try {
        console.log('starting to create users...');

        const fakeOne = await createUser({username: faker.internet.userName(), password: faker.internet.password()});

        const faketwo = await createUser({username: faker.internet.userName(), password: faker.internet.password()});

        const fakethree = await createUser({username: faker.internet.userName(), password: faker.internet.password()});

        const fakefour = await createUser({username: faker.internet.userName(), password: faker.internet.password()});

        const fakefive = await createUser({username: faker.internet.userName(), password: faker.internet.password()});
        
    } catch (error) {
        throw error; 
    }
    
}

async function startDB() {
try {
    db.connect();

    await dropTables();
    await buildInitialDb();
    await initializeUsers();

} catch (error) {

    throw error;

}finally{
 console.log('closing db connection.');
    db.end();
    }
}

startDB();
    