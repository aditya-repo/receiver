const express = require("express");
const { adminSignin, adminSignup } = require("../controllers/auth");

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/signin', adminSignin);
app.post('/signup', adminSignup);

module.exports = app;
