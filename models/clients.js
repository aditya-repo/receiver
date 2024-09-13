const { Schema, default: mongoose } = require("mongoose")

const clientSchema  = Schema({
    clientId: {
        type:String,
        unique: [true, "The Client Id should be unique."],
        required: [true, "The Client Id is required"]
    },
    occassionname:{
        type: String,
        required: [true, "Occassion Name is required"],
    },
    occassiontype: {
        type: String, 
        required: false
    },
    clientname: {
        type: String,
        required: false,
    },
    occassiondate: {
        type: Date,
        Default: Date.now,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    contact: {
        type: Number,
        minlength: [10, "Phone number should be 10 Digit"],
        maxlength: [10, "Phone number should be 10 Digit"],
        required: false
    },
    studiocode: {
        type: String,
        required: [true, "Studio Code is mandatory"]
    },
    venue: {
        type:String,
        required: false
    },
    status:{
        type: String,
        required: false
    }
})

const Client = mongoose.model(clientSchema, "clients")

module.exports = Client