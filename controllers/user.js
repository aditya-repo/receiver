const User = require("../models/users")

const deleteUser = (req, res) => {

}

const fetchAllFolderLists = (req, res) => {

}

const fetchSingleFolderLists = (req, res) => {

}

const fetchAllFileLists = (req, res) => {

}

const fetchSingleFileLists = (req, res) => {

}

const referApp = (req, res) => {

}

const updateProfile = (req, res) => {

}

const qrCode = (req, res) => {

}

const uploadImage = (req, res) => {

}

const deleteImage = (req, res) => {

}

const favourite = (req, res) => {

}

const removeFavourite = (req, res) => {

}

const adminAccess = (req, res) => {

}

const sendFollowRequest = async (req, res) => {
    const { masteruserid, slaveuserid } = req.body

    try {
        // Update the master's followers and the slave's following in parallel
        const [updatedMaster, updatedSlave] = await Promise.all([
            User.findByIdAndUpdate(
                masteruserid,
                { $set: { [`followers.${slaveuserid}`]: false } }, // Add follower with 'false' as value
                { new: true }
            ),
            User.findByIdAndUpdate(
                slaveuserid,
                { $set: { [`following.${masteruserid}`]: false } }, // Add following with 'false' as value
                { new: true }
            ),
        ]);

        if (!updatedMaster || !updatedSlave) {
            return res.status(404).json({ error: "One or both users not found." });
        }

        res.status(200).json({
            message: "Followers and following updated successfully.",
            master: updatedMaster,
            slave: updatedSlave,
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}

const acceptFollowRequest = async (req, res) => {
    const { masteruserid, slaveuserid } = req.body;

    if (!masteruserid || !slaveuserid) {
        return res.status(400).json({ error: "Both masteruserid and slaveuserid are required." });
    }

    try {
        // Update both the master and slave documents to mark the relationship as 'accepted'
        const [updatedMaster, updatedSlave] = await Promise.all([
            User.findByIdAndUpdate(
                masteruserid,
                { $set: { [`followers.${slaveuserid}`]: true } }, // Accept follower request
                { new: true }
            ),
            User.findByIdAndUpdate(
                slaveuserid,
                { $set: { [`following.${masteruserid}`]: true } }, // Mark following as accepted
                { new: true }
            ),
        ]);

        if (!updatedMaster || !updatedSlave) {
            return res.status(404).json({ error: "One or both users not found." });
        }

        res.status(200).json({
            message: "Follow request accepted successfully.",
            master: updatedMaster,
            slave: updatedSlave,
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}

const followingList = async (req, res) => {

    const { userid } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract following IDs from the map
        const followingIds = Array.from(user.following.keys());

        // Fetch details of users in the following list
        const followingProfiles = await User.find(
            { _id: { $in: followingIds } },
            { name: 1, username: 1, profileurl: 1 } // Select only required fields
        );

        res.status(200).json({
            message: "Following list retrieved successfully",
            following: followingProfiles,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const followerList = async (req, res) => {

    const { userid } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract following IDs from the map
        const followingIds = Array.from(user.follower.keys());

        // Fetch details of users in the following list
        const followingProfiles = await User.find(
            { _id: { $in: followingIds } },
            { name: 1, username: 1, profileurl: 1 } // Select only required fields
        );

        res.status(200).json({
            message: "Following list retrieved successfully",
            following: followingProfiles,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const checkUsernameAvailablity = async (req, res) => {
    const { username } = req.body;

    try {
        // Check if the username exists
        const userExists = await User.exists({ username });

        if (userExists) {
            return res.status(200).json({ available: false, message: "Username is already taken." });
        }

        res.status(200).json({ available: true, message: "Username is available." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const searchUser = async (req, res) => {
    const { query } = req.params;

    try {
        // Determine if the query is a number or alphanumeric
        const isNumber = /^\d+$/.test(query);

        // Define the search condition
        const searchCondition = isNumber ? { phone: query } : { username: query };

        // Search for the user
        const user = await User.findOne(searchCondition, { name: 1, username: 1, phone: 1, profileurl: 1 });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User found.", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    logout,
    adminAccess,
    removeFavourite,
    favourite,
    deleteImage,
    uploadImage,
    qrCode,
    updateProfile,
    referApp,
    fetchSingleFileLists,
    fetchAllFileLists,
    fetchSingleFileLists,
    fetchSingleFolderLists,
    fetchAllFolderLists,
    deleteUser,


    sendFollowRequest,
    acceptFollowRequest,
    followingList,
    followerList,
    checkUsernameAvailablity,
    searchUser
}