const mongoose = require("mongoose");

// Mongoose Schema
const resetTimerSchema = new mongoose.Schema({
  deviceId: String,
  resetTime: { type: Date, default: Date.now },
  totaltime: { type: Number, default: 0 },
});

const resetTimer = mongoose.model("TimerReset", resetTimerSchema);

module.exports = resetTimer;
