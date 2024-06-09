let report = document.querySelector('.Report .sub-report')
const Bymonth = document.querySelector("#Month")
const Byweek = document.querySelector("#Week")
const btn = document.querySelector(".btn")
const choose = document.querySelector(".choose")
let downloadPdfBtn = document.querySelector("#downloadPdfBtn")


let Error = []



choose.addEventListener("click", (e) => {
    console.log("open");
    report.classList.toggle("active")
})




// validate the input
btn.addEventListener("click", (e) => {
    e.preventDefault()
    console.log(`clicked`);
    validate()
})



const validate = async () => {
    const monthvalue = Bymonth.value;
    const weekvalue = Byweek.value;


    if (monthvalue === "" && weekvalue === "") {
        alert("You can only search either by week or Month")

    } else if (monthvalue !== "" && weekvalue !== "") {
        alert("Please fill only one field: either by week or month")
    } else {
        // Fetch the report based on the input
        const dateValue = weekvalue ? weekvalue : monthvalue;
        fetchReport(dateValue, monthvalue !== "" ? "month" : "date");
        fetchReport(dateValue);
    }
    // console.log(Error);
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
        console.log('Result:', result);

        if (response.ok) {
            reportUsers = result.users; // Update the reportUsers with the result
            console.log(reportUsers);
            // downloadPdfBtn.disabled = false;
            displayUsers();
        } else {
            // document.querySelector('#downloadPdfBtn').disabled = true;
            let errorMessage = "Error fetching report. Please try again later.";
            if (result && result.message) {
                errorMessage = result.message;
            }
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error fetching report:', error.message);
        alert("Error fetching report. Please try again later.");
        // downloadPdfBtn.disabled = false;
    }
};

// downloadPdfBtn.addEventListener('click', async () => {
//     try {
//       const response = await fetch('/generatePDF', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ data: reportUsers })
//       });
  
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = URL.createObjectURL(blob);
  
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'report.pdf';
//         link.click();
  
//         URL.revokeObjectURL(url);
//       } else {
//         alert('Error generating PDF');
//       }
//     } catch (error) {
//       console.error('Error generating PDF:', error.message);
//       alert('Error generating PDF');
//     }
//   });

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
