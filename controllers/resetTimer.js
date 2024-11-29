const Device = require("../models/device");
const ResetTimer = require("../models/resetTimer");

exports.getAllResetTimers = async (req, res) => {
    console.log("Get all reset timers");
  try {
    const resetTimers = await ResetTimer.find();
    res.status(200).json(resetTimers);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch reset timers" });
  }
};

exports.createResetTimer = async (req, res) => {
  try {
    const { deviceId, totaltime } = req.body;

    const resetTimer = new ResetTimer({ deviceId, totaltime });
    const device = await Device.findOne({ deviceId });

    if (device.originalState === "ON") {
      device.startTime = new Date();
      device.totalOnTime = 0;
    } else {
      device.startTime = null;
      device.totalOnTime = 0;
    }

    await device.save();
    await resetTimer.save();
    res.status(201).send({ message: "Reset timer created successfully", resetTimer });
  } catch (error) {
    console.error("Error creating reset timer:", error);
    res.status(500).send({ error: "Failed to create reset timer" });
  }
};
