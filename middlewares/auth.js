const jwt = require("jsonwebtoken")
const TOKEN_KEY = '45465564'
require("dotenv").config()

const STUDIO_KEY = process.env.STUDIO_KEY
const CLIENT_KEY = process.env.CLIENT_KEY

const StudioAuth = (req, res, next)=>{
    const token = req.header("Authorization")

    if (!header) {
        return res.status(401).json({"message": "No Token! Authorization denied"})
    }

    // Verify token

    try {
        const decoded = jwt.verify(token, STUDIO_KEY)
        res.user = decoded.user
    } catch (error) {
        res.status(401).json({message: "Token is invalid"})
    }
    next()
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

module.exports =  { StudioAuth, ClientAuth}