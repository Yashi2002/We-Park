// Connect to the Socket.IO server
const socket = io('http://localhost:3002');

// Function to create and append a new data entry
function appendDataEntry(data) {
    const licenseNo = data.licenseNo;
    const entryTime = data.entryTime;
    const exitTime = data.exitTime;

    const activityData = document.createElement('div');
    activityData.classList.add('activity-data');

    //div with data
activityData.innerHTML = `
    <div class="activity-data">
        <div class="number">
            <div class="time-title">License No:</div>
            <div class="time-value">${licenseNo}</div>
        </div>
        <div class="time-entry">
            <div class="time-title">Entry Time:</div>
            <div class="time-value">${entryTime}</div>
        </div>
        <div class="time-exit">
            <div class="time-title">Exit Time:</div>
            <div class="time-value">${exitTime}</div>
        </div>
    </div>
`;


    // Append the activityData div to the DOM
    document.getElementById('dataEntries').appendChild(activityData);
}

socket.on('entryExitTimeUpdate', (data) => {

    appendDataEntry(data);
});
// Listen for the 'vehicleCountUpdate' event
socket.on('vehicleCountUpdate', (count) => {
    // Update the content of the span element with the id 'totalVehicles'
    document.getElementById('totalVehicles').innerText = count;
    const totalSpace = 50; // Assuming total space is 50, you can change this value accordingly
    const availableSpace = totalSpace - count;
    document.getElementById('availableSpace').innerText = availableSpace;
});

document.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector("body"),
          modeToggle = document.querySelector(".mode-toggle"),
          sidebar = document.querySelector("nav"),
          sidebarToggle = document.querySelector(".sidebar-toggle");

    let getMode = localStorage.getItem("mode");
    if (getMode === "dark") {
        body.classList.add("dark");
    }

    let getStatus = localStorage.getItem("status");
    if (getStatus === "close") {
        sidebar.classList.add("close");
    }

    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        const newMode = body.classList.contains("dark") ? "dark" : "light";
        localStorage.setItem("mode", newMode);
    });

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
        const newStatus = sidebar.classList.contains("close") ? "close" : "open";
        localStorage.setItem("status", newStatus);
    });
});
