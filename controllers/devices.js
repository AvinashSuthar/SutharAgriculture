const Device = require("../models/device");
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch devices" });
  }
};

exports.createDevice = async (req, res) => {
  try {
    const { deviceId, name, state, originalState } = req.body;

    // Create a new device using the schema
    const device = new Device({
      deviceId,
      name,
      state: state || "OFF", // Default to "OFF" if state is not provided
      originalState: originalState || "OFF", // Default to "OFF" if originalState is not provided
    });

    // Save to the database
    await device.save();

    res.status(201).send({ message: "Device created successfully", device });
  } catch (error) {
    console.error("Error creating device:", error);
    res.status(500).send({ error: "Failed to create device" });
  }
};
exports.setStopwatch = async (req, res) => {
  try {
    const { deviceId, stopwatch } = req.body;
    console.log("Received:", deviceId, stopwatch);

    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    device.stopwatch = stopwatch; // Assign value (if it's a field)

    await device.save();

    res.json({ message: "Stopwatch updated successfully", device });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.resetStopwatch = async (req, res) => {
  try {
    const { deviceId } = req.body;

    const device = await Device.findOne({ deviceId });

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    device.stopwatch = null; // Assign value (if it's a field)

    await device.save();

    res.json({ message: "Stopwatch updated successfully", device });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
