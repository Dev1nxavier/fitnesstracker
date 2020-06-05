
let STATE={

    username: '',
    password:'',
    sessionToken: '',
}

const BASE_URL = 'http://localhost:3000/api'



$('#login_button').click(function(){
    event.preventDefault();

    console.log('Submit button clicked');

    const user = $('#usernameInput').val();
    const password = $('#inputPassword').val();

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
    .then(data => console.log(data));
})
    
