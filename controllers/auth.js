const bcrypt = require("bcryptjs")
const axios = require('axios');
const jwt = require("jsonwebtoken")
const Admin = require("../models/admin")
const Studio = require("../models/studios")
const { validationResult } = require("express-validator");
const User = require("../models/users");
require("dotenv").config()

const ADMIN_KEY = process.env.ADMIN_KEY
const STUDIO_KEY = process.env.STUDIO_KEY
const USER_JWT_KEY = process.env.USER_JWT_KEY
const MESSAGE_KEY = process.env.MESSAGE_TOKEN
const OTP_URL = process.env.OTP_URL


// In-memory array to store phone-OTP pairs
let otpStorage = [];

const studioSignin = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ "status": "validationerror", "message": "Validation Error", "details": errors.array() });
    }


    const startTime = Date.now()
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Find the user by username
        const user = await Studio.findOne({ userid: username });

        if (!user) {
            return res.json({"status": "autherror", "message": 'Username or Password Incorrect' });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({"status": "autherror", "message": 'Username or Password Incorrect' });
        }

        console.log(req.body);

        // Generate JWT token
        const token = jwt.sign(
            { username: user.studiocode },
            STUDIO_KEY, // Replace with your actual secret key
            { expiresIn: '1h' }
        );

        console.log("Response Time : ", (Date.now() - startTime) / 1000);


        // Respond with success
        res.status(200).json({
            message: 'Signin successful',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


const editStudio = async (req, res) => {

    try {

    } catch (error) {

    }
}


const adminSignup = async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the payload
        const payload = { username, password: hashedPassword, authrole: 1 };

        // Normally, here you would save the user to the database
        await Admin.create(payload);

        // Generate a JWT token (if required)
        const token = jwt.sign({ username }, ADMIN_KEY, { expiresIn: '1h' });

        // Respond with success
        res.status(201).json({
            message: 'User registered successfully',
            token, // Include token if needed for client-side authentication
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}


const adminSignin = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({ "status": "validationerror", "message": "Validation Error", "details": errors.array() });
    }

    const startTime = Date.now()
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await Admin.findOne({ username });

        if (!user) {
            return res.json({"status": "autherror", "message": 'Username or Password Incorrect' });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({"status": "autherror", "message": 'Username or Password Incorrect' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: user.username },
            ADMIN_KEY, // Replace with your actual secret key
            { expiresIn: '1h' }
        );

        console.log("Response Time : ", (Date.now() - startTime) / 1000);


        // Respond with success
        res.status(200).json({
            message: 'Signin successful',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const studioLogout = (req, res) => {

}


const sendOTP =  async (req, res) => {
    const { phone } = req.body;

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number. Please provide a 10-digit number.' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    
    try {
        // Payload structure
        const payload = {
            payload: {
                service: ["message"],
                user: {
                    orderid: "TM900573", // Static order ID for now
                    otp,                // Generated OTP
                    number: phone,      // Phone number
                    url: "https://photographercompany.com/"
                },
                sender: {
                    template: "OTP"
                }
            }
        };

        // API configuration
        const apiUrl = OTP_URL; // Replace with actual API URL
        const headers = {
            Authorization: MESSAGE_KEY, // Replace with your actual Authorization key
            'Content-Type': 'application/json',
        };

        // Send OTP using Axios
        const response = await axios.post(apiUrl, payload, { headers });

        if (response.status === 200) {
            // Store phone and OTP in the array
            otpStorage.push({ phone, otp });
            console.log('Current OTP Storage:', otpStorage); // Debugging
            return res.status(200).json({ message: 'OTP sent successfully' }); // Do not return OTP in production
        }

        return res.status(500).json({ error: 'Failed to send OTP' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const verifyOTP = async (req, res)=>{

    const { phone, otp } = req.body;

    // Validate inputs
    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required.' });
    }

    // Find and verify OTP in the array
    const otpRecordIndex = otpStorage.findIndex(record => record.phone === phone && record.otp === parseInt(otp));
    if (otpRecordIndex === -1) {
        return res.status(400).json({ error: 'Invalid OTP or phone number' });
    }

    // Remove the OTP record from the array
    otpStorage.splice(otpRecordIndex, 1);
    console.log('Updated OTP Storage:', otpStorage); // Debugging

    // return res.json({message:"OTP Verified"})

    try {
        // Check if the phone exists in the database
        const user = await User.findOne({ phone });

        if (user) {
            // Generate JWT token
            const token = jwt.sign({ id: user._id }, USER_JWT_KEY, { expiresIn: '1h' });
            return res.json({ message: 'success', token, profileid: user._id });
        } else {
            // Redirect to new-user page
            return res.json({ message: 'no-user', phone });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const registerUser = async (req, res)=>{

    const { phone, name, age, gender, username } = req.body;

    // Validate inputs
    if (!phone || !name || !age || !gender || !username) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if the phone number already exists
    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ error: 'Phone number already registered.' });
        }

        // Save the user to the database
        const user = new User({
            phone,
            name,
            age,
            gender,
            username
        });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, USER_JWT_KEY, { expiresIn: '10h' });

        return res.json({ message: 'success', token,  profileid: user._id  });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const resendOTP = async (req, res) => {
    const { phone } = req.body;

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number. Please provide a 10-digit number.' });
    }

    // Generate a new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        // Payload structure
        const payload = {
            payload: {
                service: ["message"],
                user: {
                    orderid: "TM900573", // Static order ID for now
                    otp,                // Generated OTP
                    number: phone,      // Phone number
                    url: "https://photographercompany.com/"
                },
                sender: {
                    template: "OTP"
                }
            }
        };

        // API configuration
        const apiUrl = OTP_URL; // Replace with actual API URL
        const headers = {
            Authorization: MESSAGE_KEY, // Replace with your actual Authorization key
            'Content-Type': 'application/json',
        };

        // Send OTP using Axios
        const response = await axios.post(apiUrl, payload, { headers });

        if (response.status === 200) {
            // Remove the previous OTP for the phone number
            otpStorage = otpStorage.filter(record => record.phone !== phone);

            // Store the new OTP
            otpStorage.push({ phone, otp });
            console.log('Updated OTP Storage after resend:', otpStorage); // Debugging
            return res.status(200).json({ message: 'OTP resent successfully' }); // Do not return OTP in production
        }

        return res.status(500).json({ error: 'Failed to resend OTP' });
    } catch (error) {
        console.error('Error resending OTP:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const userLogout = (req, res) => {

}

const adminLogout = (req, res) => {

}

module.exports = {
    studioSignin,
    studioLogout,
    adminSignin,
    adminSignup,
    adminLogout,
    userLogout,
    sendOTP,
    resendOTP,
    verifyOTP,
    registerUser
}