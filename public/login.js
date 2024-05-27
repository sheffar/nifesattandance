const loginform = document.querySelector("#loginForm");
const username = document.querySelector("#username");
const password = document.querySelector("#Password");
const Login_btn = document.querySelector("#Login_btn");



loginform.addEventListener("submit", (e) => {
    e.preventDefault();
    validatelogin()
})

const validatelogin = async () => {
    let errors = [];


    if (username.value.trim() === "") {
        errors.push("Username is required");
    }
    if (password.value.trim() === "") {
        errors.push("Password is required");
    }

    console.log(errors);

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    // Disable the button and set the text to "Loading..."
    Login_btn.disabled = true;
    Login_btn.textContent = 'Loading...';

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.value, password: password.value })
        });
 

        const data = await response.json();


        const token = sessionStorage.getItem('token');
          if (token) {
            fetch('/dashboard', {
                method: 'GET',
            headers: { 
            'Authorization': `Bearer ${token}`
        }
              })
          .then(response => {
        if (response.ok) {
        
            // if (data.message) {
            //     alert(data.message);
                sessionStorage.setItem("token", data.token);
                window.location.href = '/dashboard';
            // } else { 
            //     alert("UNAUTHORISED OR FORBIDDEN")
            // }
        } else {
            alert(data.message)
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred');
    });
} else {
    window.location.href = '/login';

}





        // if (response.ok) {

        //     if (data.message) {
        //         alert(data.message);
        //         // sessionStorage.setItem("token", data.token);
        //         window.location.href = '/dashboard';
        //         // window.location.assign('/submit');
        //     } else { 
        //         alert("AN Error Occured")
        //     }
        // } else {
        //     alert(data.message)
        // }




    } catch (e) {
        alert("there's an error")
    } finally {
        // Enable the button and reset the text
        Login_btn.disabled = false;
        Login_btn.textContent = 'Login';
    }
}

    // const token = sessionStorage.getItem('token');
    // fetch('/submit', {
    //     method: 'POST',
    //     headers: { 
    //         'Authorization': `Bearer ${token}`
    //     }
    // });
