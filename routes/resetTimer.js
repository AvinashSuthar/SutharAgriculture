const { createResetTimer, getAllResetTimers } = require("../controllers/resetTimer");

const router = require("express").Router();

router.get("/get", getAllResetTimers);
router.post("/new", createResetTimer);

module.exports = router;
