const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated"); // your JWT auth
const {
    createPickRequest,
    acceptPickRequest,
    rejectPickRequest,
    getUserPickRequests,
    deletePickRequest,
} = require("../controllers/pickRequest-controller");

// Routes
router.post("/", isAuthenticated, createPickRequest);
router.get("/", isAuthenticated, getUserPickRequests);
router.put("/accept/:id", isAuthenticated, acceptPickRequest);
router.put("/reject/:id", isAuthenticated, rejectPickRequest);
router.delete("/:id", isAuthenticated, deletePickRequest);

module.exports = router;
