const express = require("express");
const app = express();
const Vehicle = require("./models/Yolo"); // Import the model
const cors = require('cors');

app.use(cors());
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 3001;
const CONNECTION = "mongodb+srv://wepark:wepark123@cluster0.ssw2mr7.mongodb.net/Yolo?retryWrites=true&w=majority";

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);

    app.listen(PORT, () => {
      console.log("listening on port " + PORT);
    });

    server.listen(3002, () => {
      console.log('listening on port ' + 3002);
    });
  } catch (e) {
    console.log(e.message);
  }
};

io.on('connection', async (socket) => {
  console.log("A user connected:", socket.id);

  try {
    // Retrieve vehicles from the database
    const vehicles = await Vehicle.find();

    if (vehicles.length > 0) {
      vehicles.forEach(vehicle => {
        const entryTime = vehicle.entry_time;
        const exitTime = vehicle.exit_time;
        const licenseNo = vehicle.license_number;
        socket.emit('entryExitTimeUpdate', { licenseNo, entryTime, exitTime });
        // console.log(entryTime);
        // console.log(exitTime);
        // console.log(licenseNo);
      });
    } else {
      console.log("No vehicles found in the database.");
    }
  } catch (error) {
    console.error("Error fetching data from database:", error);
  }

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.get('/api/vehicles', async (req, res) => {
  try {
    const result = await Vehicle.find();
    res.send({ "Vehicles": result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', function (req, res) {
  res.sendFile('C:/Users/Ronish/Desktop/Project Minor/We Park/public/index.html');
});

Vehicle.watch().on('change', () => {
  console.log('detected');
  io.emit("my_message", "Detected");
});

io.on('connection', async (socket) => {
  console.log("A user connected:", socket.id);

  try {
    // Emit the initial count of vehicles to the frontend
    const count = await getVehicleCount();
    console.log("Current vehicle count:", count); 
    socket.emit('vehicleCountUpdate', count);
  } catch (error) {
    console.error("Error fetching data from database:", error);
  }

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Function to get the current count of vehicles
const getVehicleCount = async () => {
  try {
    const count = await Vehicle.countDocuments({ exited: false });
    return count;
  } catch (error) {
    console.error("Error getting vehicle count:", error);
    return 0;
  }
};

// Route to handle vehicle entry
app.post('/api/vehicle/entry', async (req, res) => {
  try {
    // Create a new vehicle entry in the database
    await Vehicle.create(req.body);
    // Increment the count of vehicles
    const count = await getVehicleCount();
    io.emit('vehicleCountUpdate', count);
    res.status(200).json({ message: "Vehicle entry recorded successfully" });
  } catch (error) {
    console.error("Error recording vehicle entry:", error);
    res.status(500).json({ error: "Error recording vehicle entry" });
  }
});

// Route to handle vehicle exit
app.post('/api/vehicle/exit', async (req, res) => {
  try {
    // Update the exit time for the vehicle in the database
    await Vehicle.findOneAndUpdate({ _id: req.body.vehicleId }, { exited: true });
    // Decrement the count of vehicles
    const count = await getVehicleCount();
    io.emit('vehicleCountUpdate', count);
    res.status(200).json({ message: "Vehicle exit recorded successfully" });
  } catch (error) {
    console.error("Error recording vehicle exit:", error);
    res.status(500).json({ error: "Error recording vehicle exit" });
  }
});

start();
