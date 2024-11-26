const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./server");
dotenv.config();
const Device = require("./models/device");
const Electricity = require("./models/electricity");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any frontend origin for now
  },
});

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

// REST API to fetch all devices
app.use("/devices", require("./routes/devices"));
app.use("/electricity", require("./routes/electricity"));

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A client connected");

  // Listen for state updates from the client (device states)
  socket.on("updateState", async ({ deviceId, state }) => {
    try {
      const device = await Device.findOneAndUpdate(
        { deviceId },
        { state, lastStateChange: new Date() },
        { new: true }
      );

      // Emit the full updated device object to all clients
      io.emit("stateUpdated", device);
    } catch (error) {
      console.error("Error updating state:", error);
    }
  });

  socket.on("updateOriginalState", async ({ deviceId, state }) => {
    try {
      // Find the device by its ID
      const device = await Device.findOne({ deviceId });

      if (!device) {
        console.warn(`Device with ID ${deviceId} not found.`);
        return;
      }

      let totalOnTime = device.totalOnTime || 0; // Initialize totalOnTime if not set

      // Calculate the additional on-time if the device is turning OFF
      if (state === "OFF" && device.startTime) {
        const additionalOnTime = Math.ceil((new Date() - new Date(device.startTime)) / 1000); // Calculate duration
        totalOnTime += additionalOnTime; // Add to the totalOnTime
      }

      // Prepare updated fields
      const updatedFields = {
        originalState: state,
        totalOnTime: state === "OFF" ? totalOnTime : Math.floor(device.totalOnTime), // Update total on-time when OFF
        startTime: state === "ON" ? new Date() : null, // Set startTime if ON, null if OFF
        lastStateChange: new Date(), // Update the last state change timestamp
      };

      // Update the device in the database
      const updatedDevice = await Device.findOneAndUpdate(
        { deviceId },
        updatedFields,
        { new: true }
      );

      // Emit the updated device object to all connected clients
      io.emit("originalStateUpdated", updatedDevice);
    } catch (error) {
      console.error(
        "Error updating device state in the database:",
        error.message
      );
    }
  });

  // Listen for electricity state updates
  socket.on("updateElectricityState", async (newState) => {
    try {
      // Update the electricity state in the database
      const electricity = await Electricity.findOneAndUpdate(
        {}, // Find the first matching record (or create one if none exists)
        { state: newState.state, lastStateChange: new Date() }, // Update the state and timestamp
        { new: true, upsert: true } // If no document is found, create one
      );

      // Emit the updated electricity state to all connected clients
      io.emit("electricityStateUpdated", electricity);
    } catch (error) {
      console.error("Error updating electricity state:", error);
    }
  });
  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
