const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const { sendMessage, getMessage } = require("../controllers/message-controller");

router.post("/send/:id", isAuthenticated, sendMessage);
router.get("/chat/:id", isAuthenticated, getMessage);

module.exports = router;
