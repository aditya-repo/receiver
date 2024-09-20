const mongoose = require("mongoose")
const {Schema} = mongoose

const proUserSchema = new Schema({
    username:{
        type: String,
    },
    password: {
        type: String
    },
    studiocode: {
        type: String
    },
    clientcode: {
        type: String
    },
    usertype: {
        type: String,
        enum: ['mobile', 'tv'],
        default: 'mobile'
    }
}, {timestamps: true})

const ProUser = mongoose.model("Prouser", proUserSchema)

module.exports = ProUser