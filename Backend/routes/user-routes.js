const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../middlewares/multer");
const router = express.Router();
const { getProfile, editProfile, deleteProfilePicture } = require("../controllers/user-controller");


router.get("/profile/:id", getProfile);
router.put("/edit-profile", isAuthenticated, upload.single("profilePicture"), editProfile);
router.delete("/delete-profile-picture", isAuthenticated, deleteProfilePicture);
router.post("/follow/:id", isAuthenticated, followOrUnfollow);

module.exports = router;