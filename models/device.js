const mongoose = require("mongoose");

// Mongoose Schema
const deviceSchema = new mongoose.Schema({
  deviceId: String,
  name: String,
  state: { type: String, enum: ["ON", "OFF"], default: "OFF" },
  originalState: { type: String, enum: ["ON", "OFF"], default: "OFF" },
  startTime: { type: Date, default: null },
  totalOnTime: { type: Number, default: 0 },
  lastStateChange: { type: Date, default: Date.now },
  stopwatch: {
    type: Number,
    default : null
  },
});

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
