const express = require("express");
const { addCampus, getUser } = require("../controllers/testController");
const router = express.Router();

router.post("/add", addCampus);
router.get("/get", getUser)

module.exports = router;