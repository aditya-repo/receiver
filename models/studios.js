const mongoose = require('mongoose')

const studioSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Studio Name is required"],
        trim: true,
    },
    userid: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: [true, "Username not available"]
    },
    studiocode: {
        type: String,
        required: [true, "Studio Code is required"],
        trim: true,
        unique: [true, "Studio Code should be unique"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    description: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    ratings: {
        type: String,
        required: false,
    },
    contact1: {
        type: Number,
        required: true,
        minlength: [10, "Conctact Number 1 should be 10 digits"],
        minlength: [10, "Conctact Number 1 should be 10 digits"],
    },
    contact2: {
        type: Number,
        required: false,
        minlength: [10, "Conctact Number 2 should be 10 digits"],
        minlength: [10, "Conctact Number 2 should be 10 digits"],
    },
    email: {
        type: String,
        required: false
    }
})

const Studio = mongoose.model(studioSchema, "Studios")

export default Studio