const username = document.querySelector(".usern");
const password = document.querySelector(".userp");
const email = document.querySelector(".email");
const loginform = document.querySelector(".signup");
const Login_btn = document.querySelector(".Login_btn");
const emailRegex = /@gmail\.com$/;


loginform.addEventListener("submit", (e) => {
    e.preventDefault();
    validatelogin();
});



const validatelogin = async () => {
    let errors = [];

    if (username.value.trim() === "") {
        errors.push("Username is required");
    }
    let psvalidation = (password.value.trim() === "") ? errors.push("Password is required") : "";
    let emvalidation = (email.value.trim() === "") ? errors.push("Emailis required") : (!email.value.match(emailRegex)) ? errors.push("Please input a valid email") : "";

    console.log(errors);

    if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
    }

    // Disable the button and set the text to "Loading..."
    Login_btn.disabled = true;
    Login_btn.textContent = "Loading...";


    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value
            }),
        });

        const data = await response.json();
        if (response.ok) {

            if (data.message) {

                alert(data.message);
                window.location.href = '/dashboard';
            } else {
                alert("An Error Occured")
            }
        } else {
            alert(data.message)
        }


    } catch (e) {
        alert(e.message);
    } finally {
        // Enable the button and reset the text 
        Login_btn.disabled = false;
        Login_btn.textContent = "SIGN UP";
    }
};