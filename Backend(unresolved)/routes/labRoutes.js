const express = require("express");
const router = express.Router();

const labController = require("../controllers/labController");

router.post("/launch", labController.launchLab);

module.exports = router;