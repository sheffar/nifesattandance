
let array = []

const getabsent = async () => {
    try {

        const response = await fetch("/Adsentees", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
            const data = await response.json()

            if (data.missingUsers && data.missingUsers.length > 0) {
            const newItems = data.missingUsers.filter(newItem => !array.some(existingItem => existingItem.username === newItem.username));

                array = [...array, ...newItems]
                render()
            } else {
                alert(data.message)
                alert("No absentees found or an error occurred.");
            }
        } else {
            alert(data.message)
        }

    } catch (e) {
        console.log(e.message);
    }
}
let gridcontainer = document.querySelector(".grid-container");

const render = () => {
    gridcontainer.innerHTML = "";
    array.map((el) => {
        console.log(el.username);
        gridcontainer.innerHTML += `
        <div class="grid-item">
        <p class="glevel"><span>Level: </span>${el.levelinschool}lv</p>
        <p class="gnamae"><span>Name: </span> ${el.username}</p>
        <p class="glodge"><span>Lodge: </span> ${el.lodge}</p>
        <p class="gphonenumber"><span>PhoneNumber:</span> ${el.phonenumber}</p>
        </div> 
        `
    })
}

let search = document.querySelector("#search");
let showsearchDIv = document.querySelector(".showsearch")
console.log(showsearchDIv);

search.addEventListener("onkeypress", (e) => {
    e.preventDefault();

    if (search.value.length >= 4) {
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

// show the search result
const show = () => {
    showsearchDIv.innerHtml = "";

    searcharray.map((el) => {
        showsearchDIv.innerHTML += `
        <p>${el.username}</p>
        `
    })
}