const jwt = require("jsonwebtoken")
require("dotenv").config()

const ADMIN_KEY = process.env.ADMIN_KEY
const STUDIO_KEY = process.env.STUDIO_KEY

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

const studioAuth = (req, res, next)=>{
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(403).json({ message: 'Access denied' });
    }    

    try {
        const decoded = jwt.verify(token, STUDIO_KEY);
        req.user = decoded; // Store decoded user data in request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports =  { adminAuth, studioAuth}