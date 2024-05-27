let gridcontainer = document.querySelector(".grid-container");

let array = []

const getabsent = async () => {
    array = []
    try {

        const response = await fetch("/Adsentees", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await response.json()

        if (response.ok) {
            if (data.missingUsers && data.missingUsers.length > 0) {
                array = [...array, data]
            } else {
                alert("No absentees found or an error occurred.");
            }
        } else {
            alert(data.message)
        }

    } catch (e) {
        console.log(e.message);
    }
}

const render = () => {

    array.map((el) => {
        gridcontainer = "";
        gridcontainer.innerHTML += `
        <div class="grid-item">
        <p class="glevel"><span>Level: </span>namelv</p>
        <p class="gnamae"><span>Name: </span> Emmanuel enemanku</p>
        <p class="glodge"><span>Lodge: </span> God's own shelter</p>
        <p class="gphonenumber"><span>PhoneNumber:</span> 12345678901</p>

    </div>
        `
    })
}