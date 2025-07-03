const User = require("../models/user-model");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("../config/cloudinary");


const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
            .select("-password")
            .populate({
                path: 'posts',
                options: { sort: { createdAt: -1 } }
            })
            .populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
}

const editProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                folder: "profile_pictures",
                public_id: `user_${userId}`,
                resource_type: "auto"
            });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

const deleteProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user || !user.profilePicture) {
            return res.status(404).json({ message: "No profile picture to delete." });
        }

        await cloudinary.uploader.destroy(`profile_pictures/user_${userId}`);

        user.profilePicture = "";
        await user.save();

        return res.status(200).json({
            message: "Profile picture deleted successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete profile picture.",
            success: false
        });
    }
};


const suggestedUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Get current user data to access their following list
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // List of users to exclude self + already following
        const excludedIds = [currentUserId, ...currentUser.following];

        // Finding users not in excluded list, limited to 5 suggestions
        const suggestions = await User.find({
            _id: { $nin: excludedIds }
        }).select("username profilePicture bio").limit(5);

        return res.status(200).json({
            success: true,
            users: suggestions
        });

    } catch (error) {
        console.error("Error suggesting users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const followOrUnfollow = async (req, res) => {
    try {
        const currentUserId = req.user.id; // The logged-in user
        const targetUserId = req.params.id; // The user to follow/unfollow

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        const isAlreadyFollowing = currentUser.following.includes(targetUserId);

        if (isAlreadyFollowing) {
            // Unfollow
            await Promise.all([
                User.updateOne({ _id: currentUserId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: currentUserId } }),
            ]);
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // Follow
            await Promise.all([
                User.updateOne({ _id: currentUserId }, { $push: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $push: { followers: currentUserId } }),
            ]);
            return res.status(200).json({ message: 'Followed successfully', success: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};


module.exports = { getProfile, editProfile, deleteProfilePicture, suggestedUsers , followOrUnfollow};
