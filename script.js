
let STATE={

    username: '',
    password:'',
    hashpassword:'',
    sessionToken: '',
    login: false,

}

const BASE_URL = 'http://localhost:3000/api'

async function refreshState() {
    const app=$('#app');

        if (!STATE.login) {
        
        
         const form= $(`
         <div id="login-form">
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
                <div class="form-group form-check">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1">
                  <label class="form-check-label" for="exampleCheck1">Keep me signed in</label>
                </div>
                <button type="submit" class="btn btn-primary" id="login_button">Register</button>
              </form>
            </div>
            <div id="login-form">
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
                <div class="form-group form-check">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1">
                  <label class="form-check-label" for="exampleCheck1">Keep me signed in</label>
                </div>
                <button type="submit" class="btn btn-primary" id="login_button">Register</button>
              </form>
            </div>`);

              app.append(form);
        }else{
            app.empty(); 
            const content = $(`<div class="container"></div>`);

        app.append(jumbotron);
        }  
}


$('#app').on('click','#login_button',function(){
    event.preventDefault();

    console.log('Submit button clicked');

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
        console.log(data)
        STATE.username = data.user.username;
        STATE.hashpassword = data.user.password;
        login(STATE.username, STATE.password)
    })
    .then(getPublicRoutines())

})

async function login(username, password) {
    const params = {
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            username,
            password
        })
    };

    const res = fetch(`${BASE_URL}/users/login`, params )
    .then(res => res.json())
    .then(data=>{
        console.log(data);
        STATE.sessionToken = data.token;
        STATE.login = true; 
        alert('Login successful');
    })
    .then(getPublicRoutines())
}

async function getPublicRoutines() {

    const params = {
        method: "POST",
        headers:{'Content-Type': 'application/json'}
    };

    fetch(`${BASE_URL}/routines`,params)
        .then(res=>res.json())
        .then(data=>{
            console.log(data);

        })
}
    
$(document).ready(refreshState());