const mongoose = require("mongoose")
const { Schema } = mongoose

const walletScehma = new Schema({
    studiocode: {
        type: String,
        require: true,
        unique: true
    },
    amount: {
        type: Number,
    }
}, {timestamps: true})

const Wallet = mongoose.model("wallet", walletScehma)

module.exports = Wallet