const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../middlewares/multer");
const router = express.Router();
const { getProfile, editProfile, deleteProfilePicture, followOrUnfollow, suggestedUsers, getUserFollowers, getUserFollowing } = require("../controllers/user-controller");


router.get("/profile/:id", getProfile);
router.put("/edit-profile", isAuthenticated, upload.single("profilePicture"), editProfile);
router.delete("/delete-profile-picture", isAuthenticated, deleteProfilePicture);
router.post("/follow/:id", isAuthenticated, followOrUnfollow); //router.patch
router.get("/suggested-user", isAuthenticated, suggestedUsers);
router.get("/followers", isAuthenticated, getUserFollowers);
router.get("/followers/:id", isAuthenticated, getUserFollowers);
router.get("/following", isAuthenticated, getUserFollowing);
router.get("/following/:id", isAuthenticated, getUserFollowing);


module.exports = router;