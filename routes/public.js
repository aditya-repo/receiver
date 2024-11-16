const express = require("express")
const { sendOTP, verifyOTP, registerUser, resendOTP } = require("../controllers/auth")
const app = express()

app.route('/send-otp').post(sendOTP)
app.route('/resend-otp').post(resendOTP)
app.route('/verify-otp').post(verifyOTP)
app.route('/register-user').post(registerUser)

module.exports = app