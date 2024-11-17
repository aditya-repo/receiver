const express = require("express")
const { sendOTP, verifyOTP, registerUser, resendOTP } = require("../controllers/auth")
const { sendFollowRequest, acceptFollowRequest, checkUsernameAvailablity, searchUser } = require("../controllers/user")
const app = express()

app.route('/send-otp').post(sendOTP)
app.route('/resend-otp').post(resendOTP)
app.route('/verify-otp').post(verifyOTP)
app.route('/register-user').post(registerUser)
app.route('/send-friend-request').post(sendFollowRequest)
app.route('/accept-friend-request').post(acceptFollowRequest)
app.route('/check-user-availablity').post(checkUsernameAvailablity)
app.route('/search-user').post(searchUser)

module.exports = app