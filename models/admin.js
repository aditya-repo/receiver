const { Schema, default: mongoose } = require("mongoose")

const AdminSchema = Schema({
    userid : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Admin = mongoose.model(AdminSchema, "Admin")

export default Admin