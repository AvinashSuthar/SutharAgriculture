const { Router } = require("express");
const {
  getElectricityState,
  createElectricityState,
  updateElectricityState,
} = require("../controllers/electricity");

const router = Router();

// REST API to fetch the electricity state
router.get("/get", getElectricityState);

// REST API to create a new electricity state
// router.post("/new", createElectricityState);

module.exports = router;
