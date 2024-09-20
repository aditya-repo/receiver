const express = require("express");
const { studioSignup } = require("../controllers/auth");
const { getDashboardDetails, singleStudio, updateStudio } = require("../controllers/admin");

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', getDashboardDetails);

app.post('/studio-signup', studioSignup);
app.get('/studio-info/:studiocode', singleStudio).post('/studio-info/:studiocode', updateStudio);

module.exports = app