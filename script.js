
let STATE={

    username: '',
    password:'',
    hashpassword:'',
    sessionToken: '',
    login: false,
    Publicroutines:[],
    activities:[]
}

let routineId;

const BASE_URL = 'http://localhost:3000/api'

async function refreshState() {
    const app=$('#app');

        if (!STATE.login) {
        
        
         const form= $(`
        <div class="jumbotron" id="login-register-jumbo"> 
         <div id="login-form">
            <h1 class="display-4" id="login-header">LOGIN</h1>
            <form>
                <div class="form-group">
                    <label for="username_login">Username</label>
                    <input type="text" class="form-control" id="username_login" aria-describedby="username">
                  </div>
                <div class="form-group">
                  <label for="password_login">Enter Password</label>
                  <input type="password" class="form-control" id="password_login">
                </div>
                <div class="form-group form-check">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1">
                  <label class="form-check-label" for="exampleCheck1">Keep me signed in</label>
                </div>
                <button type="submit" class="btn btn-primary" id="login_button">Login</button>
              </form>
            </div>
        <div id="register-form">
            <h1 class="display-4">WELCOME!</h1>
            <form>
                <div class="form-group">
                  <label for="emailInput">Email address</label>
                  <input type="email" class="form-control" id="emailInput" aria-describedby="emailHelp">
                  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                    <label for="usernameInput">Username</label>
                    <input type="text" class="form-control" id="usernameInput" aria-describedby="username">
                    <small id="username" class="form-text text-muted">Create new username</small>
                  </div>
                <div class="form-group">
                  <label for="inputPassword">Create password</label>
                  <input type="password" class="form-control" id="inputPassword">
                </div>
                <button type="submit" class="btn btn-primary" id="register_button">Register</button>
              </form>
            </div>
        </div>
            `);

              app.append(form);
        }
}


$('#app').on('click','#register_button',function(){
    event.preventDefault();

    console.log('Register button clicked');

    const user = $('#usernameInput').val();
    const password = $('#inputPassword').val();

    STATE.password = password;

    const params = {
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            username: user,
            password: password
        })
    };

    const res = fetch(`${BASE_URL}/users/register`, params )
    .then(res => res.json())
    .then(data => {
        console.log(data, 'New user: ', data.user.username);
        STATE.username = data.user.username;
        STATE.hashpassword = data.user.password;
        login(STATE.username, STATE.password)
    })
    .then(getPublicRoutines())

})

$('#app').on('click', '#login_button', async function (event) {
    event.preventDefault();
    console.log('Login button clicked');

    const username = $('#username_login').val();
    const password = $('#password_login').val();

    console.log('Username entered: ', username, 'Password:', password);
    await login(username, password);    

})

async function login(username, password) {

    console.log('Entered User Login: ', username, password);
    const params = {
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            username: username,
            password: password
        })
    }
    try {
        const res = fetch(`${BASE_URL}/users/login`, params )
        .then(res => res.json())
        .then(data=>{
            console.log(data);
            STATE.username = username;
            STATE.password = password;
            STATE.sessionToken = data.token;
            STATE.login = true; 
            alert('Login successful');
        })
        .then(getPublicRoutines)
    } catch (error) {
        throw error;
    }

}

async function getPublicRoutines() {
console.log('Entered getPublicRoutines');
    const params = {
        method: "GET",
        headers:{'Content-Type': 'application/json'}
    };

    fetch(`${BASE_URL}/routines`,params)
        .then(res=>res.json())
        .then(data=>{
            console.log('Your routines:',data);
            STATE.Publicroutines=data.data;
            displayRoutines(data.data);
        })
   
}

async function getAllActivitiesArray() {
    const params = {
        method:"GET",
        headers:{'Content-Type': 'application/json'}
    };

    fetch(`${BASE_URL}/activities`, params)
        .then(res=>res.json())
        .then(data=>{
            console.log('All Activities from getAllActivitiesArray: ', data.activities);
            STATE.activities = data.activities; 
            renderActivities(data.activities);
        })
}

async function displayRoutines(routines) {
    console.log('Entered displayRoutines. Routines: ', routines);
    const app = $('#app');
    app.empty();

    const routinesDiv = $(`<div class = "routines_container"></div>`);
    routines.forEach(function(routine){
        routinesDiv.append(renderRoutineCard(routine));
    });

    console.log('routines Div: ', routinesDiv);

    app.append(routinesDiv);
}

function renderRoutineCard(routine) {
    const { name, goal, author:{username}=''} = routine;

    // console.log('name:',name, 'goal:',goal, 'author:',username);
    const card = $(`
    <div class="card" style="width: 18rem;">
    <img src="resources/dumbells.jpg" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">${name}</h5>
      <p class="card-text"><small class="text-muted">${username}</small></p>
      <p class="card-text">S${goal}</p>
      <a href="#" class="btn btn-primary add-activity">Add Activity</a>
    </div>
    `);

    card.data('routine', routine);

    return card;
}


function renderActivities(activities) {
    console.log(Array.isArray(activities), 'OR IS THIS AN OBJECT?', typeof activities);

    const divContainer =$(`<div class="card-group"></div>`);

    activities.map(activity=>{

        const { name, description} = activity;

        const list = $(`
            <a href="#" class="card-group-item list-group-item-action activity_list_item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${name}</h5>
                </div>
                <p class="mb-1">${description}</p>
            </a>`)

            list.data('activity', activity);
            divContainer.append(list);
    })
     
    $('.activities_container').append(divContainer);


}

$('#app').on('click', '.add-activity', async function(event){
    console.log('Clicked add activity');
    event.preventDefault();
    const routine = $(this).closest('.card').data('routine');
    console.log('Card routine:', routine);
    routineId = routine.id;
    // await addActivityToCurrentRoutine(routine.id, 1);
    $('.activities_drawer').css('width', "600");
})

$('.activities_drawer').on('click', '.activity_list_item',async function(){
    const activityId = $(this).data('activity').id;
    console.log('Your chosen activity: ', activityId);

    await addActivityToCurrentRoutine(routineId, activityId);

})

async function addActivityToCurrentRoutine(routineId, activityId) {
    console.log('Entered addActivityToCurrentRoutine. RoutineID:',routineId, 'activityId:', activityId, 'with sessionToken: ', STATE.sessionToken);

    const params={
        method:"POST",
        headers:{ 'Authorization': `Bearer ${STATE.sessionToken}`,
                    'Content-Type': 'application/json',
                    },
        body:JSON.stringify({
            routineId,
            activityId
        })
    }

    fetch(`${BASE_URL}/routine_activities`, params)
        .then(res=>res.json())
        .then(data=>{
            console.log('added routine to activity:', data);
            getPublicRoutines();
        })
}

async function getUserRoutines(username) {
    console.log('Entered getUserRoutines with username:', username);
    const params = {
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            username: username
        })
    };
    try {
        fetch(`${BASE_URL}/users/${username}/routines`,params)
            .then(res=>res.json())
            .then(data=>{
                console.log('Your routines:',data);
                STATE.routines=data;
                const routinesArray = new Array();
                routinesArray.push(data.routines);
                displayRoutines(routinesArray);
                console.log('data.routines: ', data.routines, 'routinesArray: ', routinesArray);
            })
    } catch (error) {
        
    }
    
}

$('.search-button').on('click', (e)=>{
    console.log('search button clicked!');

    const keywords = $('#keywords').val();

    const routinesSearch = getUserRoutines(keywords);

    console.log('your routines: ', routinesSearch)
  
    
})
    
$('.closebtn').on('click', function(){
    console.log('SLider button clicked');

    $('.activities_drawer').css('width', "0");




})

$(document).ready(
    refreshState(),
    getAllActivitiesArray(),
    );