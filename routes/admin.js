const express = require("express")
const app = express()

app.route('/').get()

module.exports = app