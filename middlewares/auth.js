const jwt = require("jsonwebtoken")
const TOKEN_KEY = '45465564'
require("dotenv").config()

const ADMIN_KEY = process.env.ADMIN_KEY

const adminAuth = (req, res, next)=>{
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(403).json({ message: 'Access denied' });
    }    

    try {
        const decoded = jwt.verify(token, ADMIN_KEY);
        req.user = decoded; // Store decoded user data in request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

const ClientAuth = (req, res, next)=>{
    const token = req.header("Authorization")

    if (!token) {
        return res.status(401).json({message: "No Token! Authorization is denied"})
    }

    try {
        const decoded = jwt.verify(token, CLIENT_KEY)
    } catch (error) {
        res.status(401).json({message: "Token is invalid"})
    }
    next()
}

module.exports =  { adminAuth, ClientAuth}