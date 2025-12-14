const express = require("express");
const router = express.Router();
const controller = require("../controllers/extensionController");

// Extension download (public endpoint - no auth required for easier access)
router.get("/download", controller.downloadExtension);

module.exports = router;
