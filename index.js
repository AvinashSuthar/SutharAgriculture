const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./server");
const socketHandler = require("./socket"); // Import the socket handler

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any frontend origin for now
  },
});

// Middleware
app.use(
  cors({
    origin: "*", // Allow multiple origins
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow credentials like cookies or headers
  })
);


app.use(express.json());

// Connect to the database
connectDB();

// REST API routes
app.use("/devices", require("./routes/devices"));
app.use("/electricity", require("./routes/electricity"));
app.use("/resetTimer", require("./routes/resetTimer"));

// Socket.IO setup
socketHandler(io); // Pass the Socket.IO server instance

// Start the server
const PORT = 3000;
module.exports = io;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
