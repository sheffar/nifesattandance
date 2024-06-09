let username = document.querySelector('#UserName');
let UserLevel = document.querySelector('#level');
let UserLode = document.querySelector('#lodge');
let PhoneNumber = document.querySelector('#PhoneNumber');
let UserCourse = document.querySelector('#Course');
let form = document.querySelector('.form');
let btn = document.querySelector('.submitBtn')
let Err = document.querySelectorAll(".Error")
let Dcg = document.querySelector("#Dcg")
let Dob = document.querySelector("#DOB")
let gender = document.querySelector("#category")//check how toget the current value 

// All the Error divs
let usernameError = document.querySelector(".usernameError")
let levelerr = document.querySelector(".levelerr")
let lodgeerror = document.querySelector(".lodgeerror")
let phoneerror = document.querySelector(".phoneerror")
let Courseerror = document.querySelector(".Courseerror")
let Dcgerror = document.querySelector(".Dcgerror")
let Doberror = document.querySelector(".Doberror")


 
let ErrorArray = []

form.addEventListener("submit", (e) => {
    e.preventDefault();
    validateInput()


})

const validateInput = async () => {
    ErrorArray = []

    if (username.value === "" || username.value.length < 5) {
        ErrorArray.push("Attandant Full Name must be Greater than 5 characters long")
        usernameError.style.display = "block"
        usernameError.innerHTML = "Attandant Full Name must be Greater than 5 characters long" 
        username.focus()
        return false;
    }

    if (UserLevel.value === "" || isNaN(UserLevel.value) || UserLevel.value.length !== 3) {
        ErrorArray.push("Attandant Level Must Be Digits Up To 3 Charcters Long")
        levelerr.style.display = "block"
        levelerr.innerHTML = "Attandant Level Must Be Digits Up To 3 Charcters Long" 
        levelerr.focus()
        return false    

    }
    if (UserLode.value === "") {
        ErrorArray.push("Lodge Input Cannot be Empty")
        lodgeerror.style.display = "block"
        lodgeerror.innerHTML = "Lodge Input Cannot be Empty" 
        lodgeerror.focus()
        return false 

    }

    if (PhoneNumber.value === "") {

        ErrorArray.push("PhoneNumber Input Cannot Be Empty")
        phoneerror.style.display = "block"
        phoneerror.innerHTML = "PhoneNumber Input Cannot Be Empty" 
        phoneerror.focus()
        return false
    }


    if (UserCourse.value === "") {

        ErrorArray.push("Course Input Cannot Be Empty")
        Courseerror.style.display = "block"
        Courseerror.innerHTML = "Course Input Cannot Be Empty" 
        Courseerror.focus()
        return false
    }
    if (Dcg.value === "") {
        ErrorArray.push("Dcg Input Cannot Be Empty")
        Dcgerror.style.display = "block"
        Dcgerror.innerHTML = "Dcg Input Cannot Be Empty" 
        Dcgerror.focus()
        return false
    }
    if (Dob.value === "" || Dob.vlaue === null) {
        ErrorArray.push("Date of Birth Must Be Inputed")
        Doberror.style.display = "block"
        Doberror.innerHTML = "Date of Birth Must Be Inputed" 
        Doberror.focus()
        return false
    }

    if (gender.value === "") {
        ErrorArray.push("A Gender Must Be Selected")
    }

    console.log(ErrorArray);


    if (ErrorArray.length > 0) {
        alert(ErrorArray.join('\n'));
        return;
    }


    //Disable submut btn 
    btn.disabled = true;
    btn.textContent = "Loading...,Wait"

    try {

        const response = await fetch("/submit", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username.value,
                levelinschool: UserLevel.value,
                lodge: UserLode.value,
                phonenumber: PhoneNumber.value,
                courseofstudy: UserCourse.value,
                dcg: Dcg.value,
                dateofbirth: Dob.value,
                gender: gender.value
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


let table = document.querySelector(".table-container");
// RENDER ATTANDANT NAMES ON HTML
const renderUserdetalils = () => {
    table.innerHTML = "";
    currentArray.map((el) => {
        table.innerHTML += `
        <table>
    <thead>
        <tr>
            <th>Username</th>
            <th>Lodge</th>
            <th>DCG Center</th>
            <th>Phone Number</th>
            <th>Level</th>
            <th>Course</th>
            <th>Date of Birth</th>
            <th>Gender</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${el.username}</td>
            <td>${el.lodge}</td>
            <td>${el.dcg}</td>
            <td>${el.phonenumber}</td>
            <td>${el.levelinschool}</td>
            <td>${el.courseofstudy}</td>
            <td>${el.dateofbirth}</td>
            <td>${el.gender}</td>
        </tr>
    </tbody>
</table>
        
        `
    })

    
}
// detailsDiv.innerHTML = "";
//     currentArray.map((el) => {
//         detailsDiv.innerHTML += `
//         <div class="Eachuser">
//         <p>${el.username}</p>
//         <p>${el.levelinschool}</p>
//         <p>${el.lodge}</p>
//         <p>${el.phonenumber}</p>
//     </div>
//         `



let search = document.querySelector("#search");
let showsearchDIv = document.querySelector(".showsearch")
console.log(showsearchDIv);

search.addEventListener("keyup", (e) => {
    e.preventDefault();

    if (search.value.length >= 3) {
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



