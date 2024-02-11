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


const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})


  
