const { body } = require('express-validator');

// Validation middleware
const validateLogin = [
    body('username')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters long.')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers.')
        ,
    
    body('password')
        .isLength({ min: 4 }).withMessage('Password  at least 4 characters.')
];

module.exports = {validateLogin}