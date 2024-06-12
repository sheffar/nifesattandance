
let btn = document.querySelector(".btn")
let BackendError = document.querySelector(".Backend-Error")

btn.addEventListener("click", (e) => {
    e.preventDefault()
    getabsent()
})
let array = []

const getabsent = async () => {
    BackendError.innerHTML = ""

    btn.disabled = true;
    btn.textContent = "Loading... Wait"

    try {

        const response = await fetch("/Adsentees", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json()
        if (response.ok) {

            if (data.missingUsers && data.missingUsers.length > 0) {
                const newItems = data.missingUsers.filter(newItem => !array.some(existingItem => existingItem.username === newItem.username));

                array = [...array, ...newItems]
                renderAbsentees()
            } else {
                // alert(data.message)
            BackendError.innerHTML = data.message

            }
        } else {
            // alert(data.message)
            BackendError.innerHTML = data.message
        }

    } catch (e) {
        btn.disabled = false;
        btn.textContent = "Get This Sunday's Absentees";
        // return alert(e.message)
        // alert("error")
        BackendError.innerHTML = e.message
        BackendError.style.display = 'block'

    }
}
// let gridcontainer = document.querySelector(".grid-container");

// const render = () => {
//     gridcontainer.innerHTML = "";
//     array.map((el) => {
//         console.log(el.username);
//         gridcontainer.innerHTML += `
//         <div class="grid-item">
//         <p class="glevel"><span>Level: </span>${el.levelinschool}lv</p>
//         <p class="gnamae"><span>Name: </span> ${el.username}</p>
//         <p class="glodge"><span>Lodge: </span> ${el.lodge}</p>
//         <p class="gphonenumber"><span>PhoneNumber:</span> ${el.phonenumber}</p>
//         </div> 
//         `
//     })
// }

const renderAbsentees = () => {
    let tablecontainer = document.querySelector(".table-container");
    let table = document.querySelector(".table");

    // table.innerHTML = "";
    table.innerHTML = `
    <thead>
        <tr>
            <th>Username</th>
            <th>Lodge</th>
            <th>Phone Number</th>
            <th>Gender</th>
        </tr>
    </thead>
    <tbody class="tbody">
    </tbody>
 `
    let tbody = document.querySelector(".tbody ");
    // Loop through the currentArray and generate table rows for each element
    array.forEach((el) => {
        // Create a new table row
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
        <td>${el.username}</td>
        <td>${el.lodge}</td>
        <td>${el.phonenumber}</td>
        <td>${el.gender}</td>
    `;
        // Append the new row to the tbody
        tbody.appendChild(newRow);
    });
    // Append the table to the table container
    tablecontainer.appendChild(table);



}

let search = document.querySelector("#search");
let showsearchDIv = document.querySelector(".showsearch")

search.addEventListener("onkeypress", (e) => {
    e.preventDefault();

    if (search.value.length >= 4) {
        searchforuser();
        // hideHtmlelement(searcharray, showsearchDIv)

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

// show the search result
const show = () => {
    showsearchDIv.innerHtml = "";

    searcharray.map((el) => {
        showsearchDIv.innerHTML += `
        <p>${el.username}</p>
        `
    })
}