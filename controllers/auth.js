const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Admin = require("../models/admin")
const Studio = require("../models/studios")
const { validationResult } = require("express-validator")
require("dotenv").config()

const ADMIN_KEY = process.env.ADMIN_KEY
const STUDIO_KEY = process.env.STUDIO_KEY

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

const userSignin = (req, res) => {

}

const userSignup = (req, res) => {

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
    userSignup,
    userSignin,
    userLogout
}