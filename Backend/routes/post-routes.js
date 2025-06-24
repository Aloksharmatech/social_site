const express = require("express");
const router = express.Router();
const {
    addNewPost,
    getAllPost,
    getUserPost,
    likePost,
    dislikePost,
    addComment,
    getCommentsOfPost,
    deletePost,
    bookmarkPost,
} = require("../controllers/post-controller");

const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../middlewares/multer");

// Routes
router.post("/add", isAuthenticated, upload.single("image"), addNewPost);
router.get("/getallpost", isAuthenticated, getAllPost);
router.get("/user", isAuthenticated, getUserPost);

router.put("/like/:id", isAuthenticated, likePost);
router.put("/dislike/:id", isAuthenticated, dislikePost);

router.post("/comment/:id", isAuthenticated, addComment);
router.get("/comments/:id", isAuthenticated, getCommentsOfPost);

router.delete("/:id", isAuthenticated, deletePost);
router.put("/bookmark/:id", isAuthenticated, bookmarkPost);

module.exports = router;
