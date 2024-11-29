const Device = require("./models/device");
const Electricity = require("./models/electricity");
const socketHandler = (io) => {
  let activeTimers = {}; // To track timers for each deviceId

  io.on("connection", (socket) => {
    console.log("A client connected");

    // Handle reset timer event
    socket.on("resetTimer", async ({ deviceId }) => {
      try {
        const device = await Device.findOne({ deviceId });
        device.totalOnTime = 0;

        if (device.originalState === "ON") {
          // Reset the start time
          device.startTime = new Date();

          // If the device is ON, start the active timer
          if (activeTimers[deviceId]) {
            clearInterval(activeTimers[deviceId].interval);
            delete activeTimers[deviceId]; // Remove the old timer
          }

          // Set the start time to the current time
          device.startTime = new Date();

          // Start a new active timer for the device
          activeTimers[deviceId] = {
            startTime: new Date(),
            interval: setInterval(() => {
              const elapsedTime = Math.floor(
                (new Date() - activeTimers[deviceId].startTime) / 1000
              );

              // Emit real-time elapsed time to the frontend
              io.emit("realTimeUpdate", { deviceId, elapsedTime });
            }, 1000),
          };
        } else {
          device.startTime = null;
          if (activeTimers[deviceId]) {
            clearInterval(activeTimers[deviceId].interval);
            delete activeTimers[deviceId];
          }
          io.emit("originalStateUpdated", device);
        }
        await device.save();
      } catch (error) {
        console.error("Error handling resetTimer event:", error);
      }
    });

    // Handle original state updates
    socket.on("updateOriginalState", async ({ deviceId, state }) => {
      try {
        const device = await Device.findOne({ deviceId });
        let totalOnTime = device.totalOnTime || 0;

        if (state === "ON") {
          if (!activeTimers[deviceId]) {
            activeTimers[deviceId] = {
              startTime: new Date(),
              interval: setInterval(() => {
                const elapsedTime = Math.floor(
                  (new Date() - activeTimers[deviceId].startTime) / 1000 +
                    totalOnTime
                );
                io.emit("realTimeUpdate", { deviceId, elapsedTime });
              }, 1000),
            };
          }
        } else if (state === "OFF") {
          if (activeTimers[deviceId]) {
            const additionalOnTime = Math.floor(
              (new Date() - activeTimers[deviceId].startTime) / 1000
            );
            totalOnTime += additionalOnTime;
            clearInterval(activeTimers[deviceId].interval);
            delete activeTimers[deviceId];
          }
        }

        const updatedFields = {
          originalState: state,
          totalOnTime: totalOnTime,
          startTime: state === "ON" ? new Date() : null,
          lastStateChange: new Date(),
        };

        const updatedDevice = await Device.findOneAndUpdate(
          { deviceId },
          updatedFields,
          { new: true }
        );

        io.emit("originalStateUpdated", updatedDevice);
      } catch (error) {
        console.error(
          "Error updating device state in the database:",
          error.message
        );
      }
    });

    // Handle electricity state updates
    socket.on("updateElectricityState", async (newState) => {
      try {
        const electricity = await Electricity.findOneAndUpdate(
          {},
          { state: newState.state, lastStateChange: new Date() },
          { new: true, upsert: true }
        );

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
};

module.exports = socketHandler;
