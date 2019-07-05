const express = require("express");
const controller = require("../controllers/auth");
const router = express.Router();
const upload = require("../middleware/upload");

// localhost:6666/api/auth/login
router.post("/login", controller.login);

// localhost:6666/api/auth/register
router.post("/register", upload.single("image"), controller.register);

module.exports = router;
