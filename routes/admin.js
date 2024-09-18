const express = require("express");
const { studioSignup } = require("../controllers/auth");
const { getDashboardDetails } = require("../controllers/admin");

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', getDashboardDetails);

app.post('/studio-signup', studioSignup);

module.exports = app