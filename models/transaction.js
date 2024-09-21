const mongoose = require("mongoose")
const { Schema } = mongoose

const transactionSchema = new Schema({
    from: {
        type: String,
        enum: ['admin', 'studio'],
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit']
    },
    to: {
        type: String,
    },
    amount: {
        type: Number,
    },
    usertype: {
        type: String,
        enum: ['studio', 'client']
    }

}, { timestamps: true })

const Transaction = mongoose.model("transaction", transactionSchema)

module.exports = Transaction