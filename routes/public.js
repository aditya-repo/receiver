const express = require("express")
const { sendOTP, verifyOTP, registerUser, resendOTP } = require("../controllers/auth")
const { sendFollowRequest, acceptFollowRequest, checkUsernameAvailablity, searchUser, userprofile, followingList, followerList, sendUnfollowRequest, updateUserProfile, upload } = require("../controllers/user")
const { adminEventList } = require("../controllers/event")
const app = express()

app.route('/profile').post(userprofile)
app.route('/send-otp').post(sendOTP)
app.route('/resend-otp').post(resendOTP)
app.route('/verify-otp').post(verifyOTP)
app.route('/register-user').post(registerUser)
app.route('/send-friend-request').post(sendFollowRequest)
app.route('/accept-friend-request').post(acceptFollowRequest)
app.route('/check-user-availablity').post(checkUsernameAvailablity)
app.route('/search-user/:query').post(searchUser)
app.route('/following-list').post(followingList)
app.route('/follower-list').post(followerList)
app.route('/unfollow').post(sendUnfollowRequest)
app.put('/update-profile', upload.single('profileImage'), updateUserProfile);

app.route('/event/:userid').get(adminEventList)


module.exports = app