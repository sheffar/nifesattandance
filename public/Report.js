let report = document.querySelector('.Report .sub-report')
const Bymonth = document.querySelector("#Month")
const Byweek = document.querySelector("#Week")
const btn = document.querySelector(".btn")
const choose = document.querySelector(".choose")
let downloadPdfBtn = document.querySelector("#downloadPdfBtn")


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
        fetchReport(dateValue);
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
                alert(result.message)
               
            reportUsers = result.message; // Update the reportUsers with the result
            console.log(reportUsers);
            displayUsers();
            } else {
                return  alert(result.message)

            }


        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error(error.message);
        alert(error.message);
    }
};


// display users based on specified date
let tablediv = document.querySelector(".table-container")
const displayUsers = () => {
    tablediv.innerHTML = "";
    reportUsers.map((el) => {
        tablediv.innerHTML += `
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
