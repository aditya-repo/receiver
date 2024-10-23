const express = require('express')
const { cdnTransfer, imageReducer } = require('../controllers/cronjob')

const app = express()

app.route('/cdn-transfer').get(cdnTransfer)
app.route('/compressor').get(imageReducer)

module.exports = app