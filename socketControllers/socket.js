const Device = require("../models/device");
const Electricity = require("../models/electricity");

// Updates the electricity state
exports.updateElectricityState = async (newState, io) => {
  try {
    const electricity = await Electricity.findOneAndUpdate(
      {}, // Find or create the first matching record
      { state: newState.state, lastStateChange: new Date() },
      { new: true, upsert: true } // Update or create
    );

    // Emit the updated electricity state
    io.emit("electricityStateUpdated", electricity);
  } catch (error) {
    console.error("Error updating electricity state:", error.message);
  }
};

// Updates the original state of a device
exports.updateOriginalState = async ({ deviceId, state }, io) => {
  try {
    const updatedDevice = await Device.findOneAndUpdate(
      { deviceId },
      {
        originalState: state,
        lastStateChange: new Date(),
      },
      { new: true }
    );

    if (updatedDevice) {
      io.emit("originalStateUpdated", updatedDevice); // Broadcast to clients
    } else {
      console.warn(`Device with ID ${deviceId} not found.`);
    }
  } catch (error) {
    console.error("Error updating device state:", error.message);
  }
};

// Updates the current state of a device
exports.updateState = async ({ deviceId, state }, io) => {
  try {
    const device = await Device.findOneAndUpdate(
      { deviceId },
      { state, lastStateChange: new Date() },
      { new: true }
    );

    io.emit("stateUpdated", device); // Broadcast to clients
  } catch (error) {
    console.error("Error updating state:", error.message);
  }
};
