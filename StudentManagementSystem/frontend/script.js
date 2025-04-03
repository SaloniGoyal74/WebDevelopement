const API_URL = "http://127.0.0.1:5000"; // Backend URL

// Function to show sections
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(section => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}

// Function to add a student
document.getElementById("student-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Get values from form inputs
    let name = document.getElementById("name").value;
    let roll = document.getElementById("roll").value;
    let address = document.getElementById("address").value;
    let className = document.getElementById("class").value;
    let studentId = document.getElementById("student-id").value;

    // Send data to backend
    let response = await fetch(`${API_URL}/add_student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, roll, address, class: className, student_id: studentId })
    });

    let result = await response.json();
    alert(result.message);

    // Clear the form fields
    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("address").value = "";
    document.getElementById("class").value = "";
    document.getElementById("student-id").value = "";

    fetchStudents(); // Refresh student list
});

// Function to fetch all students and display in table
async function fetchStudents() {
    let response = await fetch(`${API_URL}/get_students`);
    let students = await response.json();

    let table = document.getElementById("student-table");
    let tbody = table.querySelector("tbody");
    
    // Clear existing rows
    tbody.innerHTML = "";

    students.forEach(student => {
        let row = document.createElement("tr");

        let nameCell = document.createElement("td");
        nameCell.textContent = student[0]; // Assuming student[0] is name
        row.appendChild(nameCell);

        let rollCell = document.createElement("td");
        rollCell.textContent = student[1]; // Assuming student[1] is roll number
        row.appendChild(rollCell);

        let addressCell = document.createElement("td");
        addressCell.textContent = student[2]; // Assuming student[2] is address
        row.appendChild(addressCell);

        let classCell = document.createElement("td");
        classCell.textContent = student[3]; // Assuming student[3] is class
        row.appendChild(classCell);

        let studentIdCell = document.createElement("td");
        studentIdCell.textContent = student[4]; // Assuming student[4] is student_id
        row.appendChild(studentIdCell);

        // Append the row to the table body
        tbody.appendChild(row);
    });
}

// Function to fetch individual student details
async function getStudentProfile() {
    let roll = document.getElementById("search-roll").value;
    let resultDiv = document.getElementById("profile-result");

    let response = await fetch(`${API_URL}/get_student/${roll}`);
    let student = await response.json();

    // Clear previous result
    resultDiv.innerHTML = "";

    if (student.message) {
        // Create and append error message
        let errorMessage = document.createElement("p");
        errorMessage.textContent = student.message;
        errorMessage.style.color = "red";
        resultDiv.appendChild(errorMessage);
    } else {
        // Create the profile card container
        let profileCard = document.createElement("div");
        profileCard.classList.add("id-card");

        // Add school name and logo placeholder
        let schoolHeader = document.createElement("div");
        schoolHeader.classList.add("school-header");
        let schoolName = document.createElement("h3");
        schoolName.textContent = "BORCELLE HIGHSCHOOL";
        schoolHeader.appendChild(schoolName);
        profileCard.appendChild(schoolHeader);

        // Add "Student ID Card" title
        let title = document.createElement("h2");
        title.textContent = "STUDENT ID CARD";
        title.classList.add("id-card-title");
        profileCard.appendChild(title);

        // Create a flex container for photo and details
        let contentContainer = document.createElement("div");
        contentContainer.classList.add("id-card-content");

        // Add photo placeholder
        let photoDiv = document.createElement("div");
        photoDiv.classList.add("photo-placeholder");
        let photoText = document.createElement("p");
        photoText.textContent = "Photo";
        photoDiv.appendChild(photoText);
        contentContainer.appendChild(photoDiv);

        // Create details container
        let detailsDiv = document.createElement("div");
        detailsDiv.classList.add("id-card-details");

        // Add student details
        let nameElement = document.createElement("p");
        nameElement.innerHTML = `<strong>NAME:</strong> ${student.name}`;
        detailsDiv.appendChild(nameElement);

        let idElement = document.createElement("p");
        idElement.innerHTML = `<strong>ID:</strong> ${student.student_id}`;
        detailsDiv.appendChild(idElement);

        // Since the API doesn't provide D.O.B, we'll add a placeholder or skip it
        let dobElement = document.createElement("p");
        dobElement.innerHTML = `<strong>D.O.B:</strong> Not Available`; // You can modify this if D.O.B is available in your API
        detailsDiv.appendChild(dobElement);

        let addressElement = document.createElement("p");
        addressElement.innerHTML = `<strong>ADDRESS:</strong> ${student.address}`;
        detailsDiv.appendChild(addressElement);

        // Append details to content container
        contentContainer.appendChild(detailsDiv);

        // Append content container to profile card
        profileCard.appendChild(contentContainer);

        // Append the profile card to the result div
        resultDiv.appendChild(profileCard);
    }
}


// Fetch students when the page loads
document.addEventListener("DOMContentLoaded", fetchStudents);

// Function to open the modal
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
}

// Function to close the modal
function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
}

// Click outside modal to close it (optional feature)
window.onclick = function(event) {
    if (event.target.className == "modal") {
        event.target.style.display = "none";
    }
}
