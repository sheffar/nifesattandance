let report = document.querySelector('.Report .sub-report')
const Bymonth = document.querySelector("#Month")
const Byweek = document.querySelector("#Week")
const btn = document.querySelector(".btn")
const choose = document.querySelector(".choose")
// let downloadPdfBtn = document.querySelector("#downloadPdfBtn")


let Error = []



choose.addEventListener("click", (e) => {
    report.classList.toggle("active")
})




// validate the input
btn.addEventListener("click", (e) => {
    e.preventDefault()
    validate()
})



const validate = async () => {
    const monthvalue = Bymonth.value;
    const weekvalue = Byweek.value;


    if (monthvalue === "" && weekvalue === "") {
        alert("You have to choose either Day or Month")

    } else if (monthvalue !== "" && weekvalue !== "") {
        alert("Please fill only one field: either by Day or month")
    } else {
        // Fetch the report based on the input
        const dateValue = weekvalue ? weekvalue : monthvalue;
        fetchReport(dateValue, monthvalue !== "" ? "month" : "date");
        // fetchReport(dateValue);
    }
}

// fetch user based on a specific date from the backend
let reportUsers = [];

const fetchReport = async (dateValue, type) => {
    try {
        const response = await fetch('/getReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [type]: dateValue })
        });

        const result = await response.json();


        if (response.ok) {

            if (result.message) {

                return alert(result.message)


            } else {

                reportUsers = result.users// Update the reportUsers with the result
                displayUsers();
                lengthofarray()
            }


        }
        else {
           return  alert(result.message)
        }
    } catch (error) {
        alert(error.message);
    }
};


// display users based on specified date
let tablediv = document.querySelector(".table-container")

const displayUsers = () => {
    let tablecontainer = document.querySelector(".table-container");
    let table = document.querySelector(".table");

    table.innerHTML = "";
    table.innerHTML = `
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
    <tbody class="tbody">
    </tbody>
 `

    let tbody = document.querySelector(".tbody ");
    // Loop through the currentArray and generate table rows for each element
    reportUsers.forEach((el) => {
        // Create a new table row
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
        <td>${el.username}</td>
        <td>${el.lodge}</td>
        <td>${el.dcg}</td>
        <td>${el.phonenumber}</td>
        <td>${el.levelinschool}</td>
        <td>${el.courseofstudy}</td>
        <td>${el.dateofbirth}</td>
        <td>${el.gender}</td>
    `;
        // Append the new row to the tbody
        tbody.appendChild(newRow);
    });
    // Append the table to the table container
    tablecontainer.appendChild(table);



}


const lengthofarray = () => {
    let totalHere = document.querySelector(".totalHere")
    let arraylength = reportUsers.length
    totalHere.innerHTML = arraylength

}