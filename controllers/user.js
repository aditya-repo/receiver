const User = require("../models/users")
const multer = require("multer")
const fs = require("fs")
const path = require("path")

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

const userprofile = async (req, res) => {

    const { userid } = req.body

    try {
        // Find user by ID in the database
        const user = await User.findById(userid);

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

// Configure multer for image upload (store in a local 'uploads' directory)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the directory to store uploaded images
        const uploadDir = path.join(__dirname, '../../images/profile');

        // Ensure the directory exists, if not create it
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Set a unique filename for the uploaded image (e.g., timestamp + original name)
        const filename = `${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Update user profile controller
const updateUserProfile = async (req, res) => {
    try {
        // Get user data from the request body
        const { username, name, age, gender, bio, userid } = req.body;

        // Handle image upload (if image exists in the request)
        let profileImagePath = null;
        if (req.file) {
            // Store the image path relative to the server root
            profileImagePath = `${req.file.filename}`;
        }

        // Find the user by their ID and update the profile
        const user = await User.findById(userid);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.username = username || user.username;
        user.name = name || user.name;
        user.age = age || user.age;
        user.gender = gender || user.gender;
        user.bio = bio || user.bio;
        if (profileImagePath) {
            user.profileurl = profileImagePath; // Set new profile image if available
        } else {
            user.profileurl = user.profileurl
        }

        // Save the updated user data
        await user.save();

        // Send response
        return res.status(200).json({
            message: 'Profile updated successfully',
            user: user,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Error updating profile' });
    }
};




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
    sendUnfollowRequest,
    updateUserProfile,
    upload
}