const express = require("express");
const { registerStepOne, registerStepTwo, loginUser, forgotPassword, resetPassword ,logout,getCurrentUser} = require("../controllers/auth-controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

router.post("/register", registerStepOne);      
router.post("/verify", registerStepTwo);
router.post("/login", loginUser);  
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/me", isAuthenticated, getCurrentUser);



module.exports = router;