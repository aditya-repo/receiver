const { Schema, default: mongoose } = require("mongoose")

const serviceSchema = new Schema({
    clientId: {
        type: String,
        required: [true, "Client  Id should be required"],
    },
    cloud: {
        type: String,
        enum: ['silver', 'gold', 'platinum']
    },

    folder: [
        {
            foldername: {
                type: String,
                required: [true, "Folder name is required"]
            },
            size: {
                type: Number,
                required: false
            },
            count: {
                type: Number,
                required: false
            }
        }
    ],

}, {timeseries: true})

const Service = mongoose.model("Services", serviceSchema)

module.exports = Service