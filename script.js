
let STATE={

    username: '',
    password:'',
    userId:'',
    hashpassword:'',
    sessionToken: '',
    login: false,
    Publicroutines:[],
    activities:[]
}

let routineId;

const BASE_URL = 'http://localhost:3000/api'
// const BASE_URL = '/api'

async function renderState() {
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

$('#home').click(function (e) {
    e.preventDefault();
    displayRoutines(STATE.Publicroutines);
})

$('#create-routine').click(function(e){
    $('#createRoutineModal .modal-body').empty();
    $('#createRoutineModal .modal-body').append(renderModalForm());
    $('#createRoutineModal').modal('toggle');

})

$('#createRoutineModal #submit').on('click', function(){
    const routineName = $('#modal-name').val();
    const routineGoal = $('#modal-goal').val();
    const public = $('#public').prop('checked');

    console.log('Routine:', routineName, 'Goal:', routineGoal, 'is public?', public);

    createNewRoutine({name:routineName, goal:routineGoal, isPublic:public});
    
    $('#createRoutineModal').modal('toggle');
})

async function createNewRoutine({name, goal, isPublic}){
    const params={
        method:"POST",
        headers:{ 'Authorization': `Bearer ${STATE.sessionToken}`,
                    'Content-Type': 'application/json',
                    },
        body:JSON.stringify({
            isPublic,
            name,
            goal
        })
    }

        fetch(`${BASE_URL}/routines`, params)
            .then(res=>res.json())
            .then(data=>{
                const { routine } = data
                console.log('New routine created!',routine);

                return STATE.Publicroutines.push(routine);
            })
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

            STATE.userId = data.id;
            
            if (data.token) {
                STATE.login = true;
                alert('Login Successful');
                getPublicRoutines();
            }else{
                alert('Unable to log in. Please check username & password.');
                return;
            }
        })
        // .then(getPublicRoutines)
        .catch(error=>{throw error})
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
            const { data:activities } = data;
            console.log('All Activities from getAllActivitiesArray: ', activities);
            STATE.activities = activities; 
            renderActivities(activities);
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
    const {id, activities, name, goal, author:{username}=''} = routine;
    const userId = STATE.userId;
    const authorId = routine.creatorId;
    console.log('Author and user id:',authorId, userId);

    // console.log('name:',name, 'goal:',goal, 'author:',username);
    const card = $(`
    <div class="card" style="width: 18rem;">
        <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs" id="card-tab">
                <li class="nav-item">
                    <a class="nav-link active" id="routine-tab" data-toggle="tab" href="#routine-${id}" role="tab" aria-controls="routine-${id}" aria-selected="true">Routine</a>
                </li>
                ${
                activities.length
                    ? `
                    <li class="nav-item">
                        <a class="nav-link" id="activities-tab" data-toggle="tab" href="#activities-${id}" role="tab" aria-controls="activities-${id}" aria-selected="false">Activities <span class="badge badge-info">${activities.length}</span></a>
                    </li>
                    `
                    : ""
                }
            </ul>
        </div>
        <img src="resources/dumbells.jpg" class="card-img-top">
        <div class="card-body">
            <div class="tab-content">
                <div class="tab-pane fade show active" id="routine-${id}" role="tabpanel" aria-labelledby="routine-tab">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text"><small class="text-muted">${username}</small></p>
                    <p class="card-text">${goal}</p>
                    ${userId === authorId?'<a href="#" class="btn btn-primary add-activity">Add Activity</a>':''}
                    </div>
            ${
                activities.length
                ? `
                <div class="overflow-auto tab-pane fade" id="activities-${id}" role="tabpanel" aria-labelledby="activities-tab">
                ${createRoutineCardActivities(activities)}
                </div>
                `
                : ""
            }
            </div>
        </div>
    </div>
    `);

    card.data('routine', routine);

    return card;
}

function createRoutineCardActivities(activities) {
    console.log('createRoutineCardActivities: ', activities)
    const activitiesContainer = `<div class="card-group">

    ${activities.map(activity=>{
        const {name, description} = activity;

        return `
        <a href="#" class="card-group-item list-group-item-action activity_list_item">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${name}</h5>
            </div>
            <p class="mb-1">${description}</p>
        </a>
        `;
    })
    .join("")}
    </div>`;

    return activitiesContainer;
}

function renderActivities(activities) {


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

function renderModalForm(){


    const modalForm = $(`
    <form>
        <div class="form-group">
        <input type="text" class="form-control" id="modal-name" placeholder="Routine Name">
    </div>
    <div class="form-group">
        <input type="text" class="form-control" id="modal-goal" placeholder="What do you want to achieve?">
    </div>
    <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="public">
        <label class="form-check-label" for="public">Public Routine</label>
    </div>
  </form>`)

  return modalForm;
}

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
    }
    try {
        fetch(`${BASE_URL}/users/${username}/routines`,params)
            .then(res=>res.json())
            .then(data=>{
                console.log('Your routines:',data);
                STATE.routines=data;
                const routinesArray = new Array();
                routinesArray.push(data.routines);
                displayRoutines(data.routines);
                console.log('data.routines: ', data.routines, 'routinesArray: ', routinesArray);

            })
    } catch (error) {
        console.error(error);
    }
    
}


$('#keywords').on('input', function(e){
   const searchKey= $(this).val();
   search(searchKey);
})

function search(searchKey) {
    console.log(searchKey);

    let resultsArray=[];
    const searchTerm = searchKey.toLowerCase();
    let authorSearch = STATE.Publicroutines.filter(function(routine){
        return routine.author.username.toLowerCase().indexOf(`${searchTerm}`) !==-1;
    })

    authorSearch.forEach(routine=>resultsArray.push(routine));

    displayRoutines(resultsArray);
}
    
$('.closebtn').on('click', async function(){
    console.log('SLider button clicked');

    $('.activities_drawer').css('width', "0");
    await getPublicRoutines();

});

$(document).ready(
    renderState(),
    getAllActivitiesArray(),
    );