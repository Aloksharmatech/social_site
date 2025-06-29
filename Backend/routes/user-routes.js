const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const upload = require("../middleware/multer");
const router = express.Router();
const { getProfile, editProfile, deleteProfilePicture, followOrUnfollow } = require("../controllers/user-controller");


router.get("/profile/:id", getProfile);
router.put("/edit-profile", isAuthenticated, upload.single("profilePicture"), editProfile);
router.delete("/delete-profile-picture", isAuthenticated, deleteProfilePicture);
router.post("/follow/:id", isAuthenticated, followOrUnfollow);

module.exports = router;