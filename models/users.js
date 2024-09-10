const { Schema } = require("mongoose")

const userSchema = Schema({
    username: {
        type: String,
        unique: [true, "Username should be unique"]
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
    dateofbirth: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String
    }
})

const user = mongoose.model( userSchema, "users")

export default user