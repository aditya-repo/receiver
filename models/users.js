const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const userSchema = new Schema({
    username: {
        type: String,
        unique: [true, "Username should be unique"]
    },
    profileurl:{
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: String,
        minlength: [10, "Phone number should be 10 digit"],
        maxlength: [10, "Phone number should be 10 digit"]
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    followers: {
      type: Map,
      of: Boolean, // Keys are user IDs, values are true/false
      default: {},
    },
    following: {
      type: Map,
      of: Boolean, // Keys are user IDs, values are true/false
      default: {},
    },
}, { timestamps: true })

const User = mongoose.model( "users",userSchema)

module.exports = User;