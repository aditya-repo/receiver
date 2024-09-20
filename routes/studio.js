const express = require("express")
const { getDashboard, allClient, updateClient, singleClient, deletedClient, deleteClient, getProUsers, deleteProUser } = require("../controllers/studio")
const app = express()

app.route('/').get(getDashboard)
app.route('/clients').get(allClient).delete(deletedClient)
app.route('/client/:studio').get(singleClient).post(updateClient).delete(deleteClient)
app.route('/prouser/:studio').get(getProUsers).delete(deleteProUser)


module.exports = app