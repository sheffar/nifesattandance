
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
