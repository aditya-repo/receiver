const jwt = require("jsonwebtoken")

const TOKEN_KEY = '45465564'

const AuthUncle = (req, res, next)=>{
    const token = req.header("Authorization")

    if (!header) {
        return res.status(401).json({"message": "No Token! Authorization denied"})
    }

    // Verify token

    try {
        const decoded = jwt.verify(token, TOKEN_KEY)
        res.user = decoded.user
    } catch (error) {
        res.status(401).json({message: "Token is invalid"})
    }
}

export default AuthUncle