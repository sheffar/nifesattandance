// import { response } from "express";

let username = document.querySelector('#UserName');
let UserLevel = document.querySelector('#level');
let UserLode = document.querySelector('#lodge');
let PhoneNumber = document.querySelector('#PhoneNumber');
let UserCourse = document.querySelector('#Course');
let form = document.querySelector('.form');
let btn = document.querySelector('.submitBtn')
let Err = document.querySelectorAll(".Error")
let allInput = document.querySelectorAll(".all")
console.log(btn);


// console.log(username);
let ErrorArray = []

form.addEventListener("submit", (e) => {
    e.preventDefault();
    validateInput()


})

const validateInput = async () => {
    ErrorArray = []

    if (username.value === "" || username.value.length < 5) {
        ErrorArray.push("Attandant Full Name must be Greater than 5 characters long")
    }

    if (UserLevel.value === "" || isNaN(UserLevel.value) || UserLevel.value.length !== 3) {
        ErrorArray.push("Attandant Level Must Be Digits Up To 3 Charcters Long")
    }
    // if (UserLevel.value.length === 3) {

    //     ErrorArray.push("lenght is not equal to 3")
    // }

    if (UserLode.value === "") {

        ErrorArray.push("Lodge Input Cannot be Empty")
    }

    if (PhoneNumber.value === "") {

        ErrorArray.push("PhoneNumber Input Cannot Be Empty")
    }


    if (UserCourse.value === "") {

        ErrorArray.push("Course Input Cannot Be Empty")
    }


    console.log(ErrorArray);


    if (ErrorArray.length > 0) {
        alert(ErrorArray.join('\n'));
        // highlightErrorFields()
        return;
    }
    
    const token = sessionStorage.getItem('token');

    if (!token) {
        alert("You are not logged in");
        window.location.href = '/login';
        return;
    }

    //Disable submut btn 
    btn.disabled = true;
    btn.textContent = "Loading..." 

    try {
       
        const response = await fetch("/submit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username.value,
                levelinschool: UserLevel.value, 
                lodge: UserLode.value,
                phonenumber: PhoneNumber.value,
                courseofstudy: UserCourse.value
            })
        })
        const data = await response.json()

        if (response.ok) {
  
            if (data.message) {
                alert(data.message);
                form.reset(); 
            } else {
                alert("AN Error Occured")
            }
        } else {
            alert(data.message)
        }

    } catch (e) {
        console.log(e.message);
    } finally {
        // Enable the button and reset the text
        btn.disabled = false;
        btn.textContent = "SUBMIT";
    }

}



// Function to highlight input fields with errors
const highlightErrorFields = () => {
    allInput.forEach((input, index) => {
        const errorMessage = ErrorArray[index];
        if (errorMessage) {
            input.classList.add('error'); // Add error class to input field
        } else {
            input.classList.remove('error'); // Remove error class if no error
        }
    });
};