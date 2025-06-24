const sharp = require("sharp");
const Post = require("../models/post-model");
const User = require("../models/user-model");
const Comment = require("../models/comment-model");
const cloudinary = require("../config/cloudinary");

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.user.id;

        if (!image) {
            return res.status(400).json({ message: 'Image required', success: false });
        }

        // Optimize image using Sharp
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // Convert to base64 URI
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        // Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri, {
            folder: "posts",
            public_id: `post_${Date.now()}_${authorId}`,
            resource_type: "image"
        });

        // Create post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        // Add post to user's list
        await User.findByIdAndUpdate(authorId, { $push: { posts: post._id } });

        // Populate author field (optional)
        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            success: true,
            post,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};


const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch posts'
        });
    }
};


const getUserPost = async (req, res) => {
    try {
        const authorId = req.user.id;

        const posts = await Post.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username profilePicture'
            })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({
            success: true,
            posts
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user posts'
        });
    }
};


const likePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Add userId to the likes array if not already present
        await Post.updateOne(
            { _id: postId },
            { $addToSet: { likes: userId } }
        );

        // Fetch user details to send with notification
        const likingUser = await User.findById(userId).select('username profilePicture');

        const postOwnerId = post.author.toString();
        if (postOwnerId !== userId) {
            // Real-time socket notification (if not self-liking)
            const notification = {
                type: 'like',
                userId,
                userDetails: likingUser,
                postId,
                message: 'Your post was liked'
            };

            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            if (postOwnerSocketId) {
                io.to(postOwnerSocketId).emit('notification', notification);
            }
        }

        return res.status(200).json({
            message: 'Post liked',
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};




const dislikePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Remove the user from the likes array
        await Post.updateOne(
            { _id: postId },
            { $pull: { likes: userId } }
        );

        // Fetch the disliking user's details
        const dislikingUser = await User.findById(userId).select('username profilePicture');

        const postOwnerId = post.author.toString();

        if (postOwnerId !== userId) {
            // Emit real-time notification if disliking someone else's post
            const notification = {
                type: 'dislike',
                userId,
                userDetails: dislikingUser,
                postId,
                message: 'Your post was disliked'
            };

            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            if (postOwnerSocketId) {
                io.to(postOwnerSocketId).emit('notification', notification);
            }
        }

        return res.status(200).json({
            message: 'Post disliked',
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};



const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id; // The user who is commenting
        const { text } = req.body;

        // Validate comment text
        if (!text) {
            return res.status(400).json({
                message: 'Comment text is required',
                success: false
            });
        }

        // Find the target post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Create comment
        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        });

        // Populate author info for the response
        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        });

        // Add comment to post's comments array
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment added successfully',
            success: true,
            comment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId })
            .sort({ createdAt: -1 })
            .populate('author', 'username profilePicture');

        if (comments.length === 0) {
            return res.status(404).json({
                message: 'No comments found for this post',
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            comments
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const currentUserId = req.user.id;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if the logged-in user is the owner of the post
        if (post.author.toString() !== currentUserId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You can delete only your own posts'
            });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        // Remove the post reference from the user's posts array
        const user = await User.findById(currentUserId);
        if (user) {
            user.posts = user.posts.filter(id => id.toString() !== postId);
            await user.save();
        }

        // Delete associated comments
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const currentUserId = req.user.id;

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Find the user
        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        const isBookmarked = user.bookmarks.includes(post._id);

        if (isBookmarked) {
            // Remove from bookmarks
            await user.updateOne({ $pull: { bookmarks: post._id } });
            return res.status(200).json({
                type: 'unsaved',
                message: 'Post removed from bookmarks',
                success: true
            });
        } else {
            // Add to bookmarks
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            return res.status(200).json({
                type: 'saved',
                message: 'Post bookmarked',
                success: true
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


module.exports = { addNewPost, getAllPost, getUserPost, likePost, dislikePost, addComment, getCommentsOfPost, deletePost, bookmarkPost }