const mongoose = require("mongoose");

// Mongoose Schema
const electricitySchema = new mongoose.Schema({
  state: { type: String, enum: ["ON", "OFF"], default: "OFF" },
  lastStateChange: { type: Date, default: Date.now },
});

const Electricity = mongoose.model("Electricity", electricitySchema);

module.exports = Electricity;
