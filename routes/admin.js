const express = require("express");
const { studioSignup, getSingleStudioCredit, updateSingleStudioCredit } = require("../controllers/admin");
const { getDashboardDetails, singleStudio, updateStudio } = require("../controllers/admin");
const { singleClient, updateClient, deleteClient, deleteProUser, getProUsers, newClient, allClient } = require("../controllers/studio");
const { createWallettoStudio } = require("../controllers/testController");

const app = express();

app.use(express.json(studioSignup));

app.get('/', getDashboardDetails);
app.post('/studio-signup', studioSignup);
app.get('/studio-info/:studiocode', singleStudio).post('/studio-info/:studiocode', updateStudio);
app.route('/:studiocode/new-client').post(newClient)
app.route('/:studiocode/clients').get(allClient)
app.route('/client/:clientcode').get(singleClient)
app.route('/prouser/:studio').get(getProUsers).delete(deleteProUser)
app.route('/:studiocode/wallet').get(getSingleStudioCredit).post(updateSingleStudioCredit)

app.get('/create-wallet', createWallettoStudio)

module.exports = app