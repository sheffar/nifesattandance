const loginform = document.querySelector("#loginForm");
const username = document.querySelector("#username");
const password = document.querySelector("#Password");
const Login_btn = document.querySelector("#Login_btn");


loginform.addEventListener("submit", (e) => {
    e.preventDefault();
    validatelogin();
});




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
        alert(errors.join("\n"));
        return;
    }

    // Disable the button and set the text to "Loading..."
    Login_btn.disabled = true;
    Login_btn.textContent = "Loading...";

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
            })
        });

        // checks if the resposne is a redirect and handle it
        if (response.redirected) {
            alert("login Successful, please wait")
            window.location.href = response.url;
        } else {
            const data = await response.json();
            if (response.ok) {
                if (data.message) {
                    alert(data.message);
                } else {
                    alert("An error occurred");
                }
            } else {
                alert(data.message || "An error occurred");
            }
        }

    } catch (e) {
        alert("there's an error");
    } finally {
        // Enable the button and reset the text 
        Login_btn.disabled = false;
        Login_btn.textContent = "Login";
    }
};




