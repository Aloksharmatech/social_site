const express = require("express");
const { registerStepOne, registerStepTwo, loginUser, forgotPassword, resetPassword ,logout} = require("../controllers/auth-controller");
const router = express.Router();

router.post("/register", registerStepOne);      
router.post("/verify", registerStepTwo);
router.post("/login", loginUser);  
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);


module.exports = router;