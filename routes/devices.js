const { Router } = require("express");
const {
  getDevices,
  createDevice,
  setStopwatch,
  resetStopwatch,
} = require("../controllers/devices");

const router = Router();

// REST API to fetch all devices
router.get("/get", getDevices);
router.post("/stopwatch", setStopwatch);
router.post("/resetstopwatch", resetStopwatch);

// REST API to create a new device
// router.post("/new", createDevice);

module.exports = router;
