
let username = document.querySelector('#UserName');
let UserLevel = document.querySelector('#level');
let UserLode = document.querySelector('#lodge');
let PhoneNumber = document.querySelector('#PhoneNumber');
let UserCourse = document.querySelector('#Course');
let form = document.querySelector('.form');
let btn = document.querySelector('.submitBtn')
let Err = document.querySelectorAll(".Error")
let allInput = document.querySelectorAll(".all")


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


    // highlightErrorFields()
    if (ErrorArray.length > 0) {
        alert(ErrorArray.join('\n'));
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
        const data = await response.json()// convert the response to json

        if (response.ok) {//if the response is ok!!!

            if (data.message) {//If it was successfully converted to json!!!, alert message
                alert(data.message);
                form.reset();//Reset the form
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
// const highlightErrorFields = () => {
//     allInput.forEach((input, index) => {
//         const errorMessage = ErrorArray[index];
//         console.log(errorMessage);
//         if (errorMessage) {
//             input.classList.add('er'); // Add error class to input field
//         } else {
//             input.classList.remove('er'); // Remove error class if no error
//         }
//     });
// };

// fetch the list of attendant for that day

let currentArray = []
const fetchdetails = async () => {

    try {
        const response = await fetch("/getcurrentusers")

        if (response.ok) {
            const data = await response.json();
            // Filter out duplicate items based on username
            const newItems = data.filter(newItem => !currentArray.some(existingItem => existingItem.username === newItem.username));

            currentArray = [...currentArray, ...newItems]

            console.log(currentArray);
            renderUserdetalils()


        } else {
            console.log("An Error Occured");
        }
    } catch (error) {
        console.log(error);
    }

}


let detailsDiv = document.querySelector(".currentDetails");
// RENDER ATTANDANT NAMES ON HTML
const renderUserdetalils = () => {
    detailsDiv.innerHTML = "";
    currentArray.map((el) => {
        detailsDiv.innerHTML += `
        <div class="Eachuser">
        <p>${el.username}</p>
        <p>${el.levelinschool}</p>
        <p>${el.lodge}</p>
        <p>${el.phonenumber}</p>
    </div>
        `
    })
}



let search = document.querySelector("#search");
let showsearchDIv = document.querySelector(".showsearch")
console.log(showsearchDIv);

search.addEventListener("keyup", (e) => {
    e.preventDefault();

    if (search.value.length >= 5) {
        searchforuser();
    }
});

let searcharray = [];
const searchforuser = async () => {
    try {
        const response = await fetch("/searchForAttandant", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: search.value })
        });

        if (response.ok) {

            const data = await response.json();
            const newItems = data.filter(newItem => !searcharray.some(existingItem => existingItem.username === newItem.username));
            searcharray = [...searcharray, ...newItems];
            hideHtmlelement()
            console.log(searcharray);

            show()

        } else {

            const errorData = await response.json();
            console.error("Error:", errorData.message);
        }
    } catch (err) {
        console.error("Fetch error:", err.message);
    }
};

const hideHtmlelement = () => {
    if (searcharray.length > 0) {
        showsearchDIv.style.display = " block"
    } else {
        showsearchDIv.style.display = "none"

    }
}
// show the search result
const show = () => {
    showsearchDIv.innerHtml = "";

    searcharray.map((el) => {
        showsearchDIv.innerHTML += `
        <p>${el.username}</p>
        `
    })
}



