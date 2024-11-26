const { Router } = require("express");
const { getDevices, createDevice } = require("../controllers/devices");

const router = Router();

// REST API to fetch all devices
router.get("/get", getDevices);

// REST API to create a new device
// router.post("/new", createDevice);

module.exports = router;
