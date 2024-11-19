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
    const { masterid, slaveid } = req.body

    console.log(req.body);
    

    try {
        // Update the master's followers and the slave's following in parallel
        const [updatedMaster, updatedSlave] = await Promise.all([
            User.findByIdAndUpdate(
                masterid,
                { $set: { [`followers.${slaveid}`]: false } }, 
                { new: true }
            ),
            User.findByIdAndUpdate(
                slaveid,
                { $set: { [`following.${masterid}`]: false } }, 
                { new: true }
            ),
        ]);

        if (!updatedMaster || !updatedSlave) {
            return res.status(404).json({ error: "One or both users not found." });
        }

        const user = await User.findById(slaveid)

        res.json({
            message: "request-sent",
            user
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}

const sendUnfollowRequest = async (req, res) => {
    const { masterid, slaveid } = req.body;

    console.log(req.body);

    try {
        // Remove the master's followers and the slave's following in parallel
        const [updatedMaster, updatedSlave] = await Promise.all([
            User.findByIdAndUpdate(
                masterid,
                { $unset: { [`followers.${slaveid}`]: "" } }, // Remove the follower
                { new: true }
            ),
            User.findByIdAndUpdate(
                slaveid,
                { $unset: { [`following.${masterid}`]: "" } }, // Remove the following
                { new: true }
            ),
        ]);

        if (!updatedMaster || !updatedSlave) {
            return res.status(404).json({ error: "One or both users not found." });
        }

        const user = await User.findById(slaveid);

        res.json({
            message: "unfollowed-successfully",
            user,
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};


const acceptFollowRequest = async (req, res) => {
    const { masterid, slaveid } = req.body;

    if (!masterid || !slaveid) {
        return res.status(400).json({ error: "Both masteruserid and slaveuserid are required." });
    }

    try {
        // Update both the master and slave documents to mark the relationship as 'accepted'
        const [updatedMaster, updatedSlave] = await Promise.all([
            User.findByIdAndUpdate(
                masterid,
                { $set: { [`followers.${slaveid}`]: true } }, // Accept follower request
                { new: true }
            ),
            User.findByIdAndUpdate(
                slaveid,
                { $set: { [`following.${masterid}`]: true } }, // Mark following as accepted
                { new: true }
            ),
        ]);

        if (!updatedMaster || !updatedSlave) {
            return res.status(404).json({ error: "One or both users not found." });
        }

        res.status(200).json({
            message: "Follow request accepted successfully.",
            master: updatedMaster,
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}

const followingList = async (req, res) => {

    console.log(req.body);
    
    const { userid } = req.body;

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

        res.json({
            message: "success",
            followinglist: followingProfiles,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const followerList = async (req, res) => {

    const { userid } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract following IDs from the map
        const followingIds = Array.from(user.followers.keys());

        // Fetch details of users in the following list
        const followingProfiles = await User.find(
            { _id: { $in: followingIds } },
            { name: 1, username: 1, profileurl: 1 } // Select only required fields
        );

        res.json({
            message: "success",
            followerlist: followingProfiles,
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
        // Check if the query is a valid 10-digit number
        const isPhoneNumber = /^\d{10}$/.test(query);

        // Define the search condition based on the query type
        const searchCondition = isPhoneNumber 
            ? { phone: query } 
            : { username: { $regex: query, $options: 'i' } }; // Case-insensitive regex for pattern matching
    
        // Search for the user with the specified fields
        const user = await User.find(searchCondition, {
            name: 1,
            username: 1,
            phone: 1,
            profileurl: 1
        });

        if (!user) {
            return res.json({ message: "not-found" });
        }

        // Return the found user
        res.json(user);

    } catch (error) {
        console.error("Error while searching user:", error);
        res.status(500).json({ message: "server-error" });
    }
};

const userprofile = async (req, res)=>{
    
    const {profileid} = req.body
    try {
        // Find user by ID in the database
        const user = await User.findById(profileid);

        // If user is not found, return 404 error
        if (!user) {
            return res.json({ message: 'User not found' });
        }

        // Return user data
        return res.json({ user });
    } catch (error) {
        // If there is any error (e.g. invalid ObjectId format), catch it
        console.error('Error fetching user by ID:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const unsendFollowRequest = async (req, res)=>{

}


module.exports = {
    // logout,
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
    searchUser,
    userprofile,
    sendUnfollowRequest
}