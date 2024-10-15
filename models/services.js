const { Schema, default: mongoose } = require("mongoose")

const serviceSchema = new Schema({
    clientId: {
        type: String,
        required: [true, "Client  Id should be required"],
    },
    cloud: {
        type: String,
        enum: ['silver', 'gold', 'platinum', 'none'],
        default: 'none'
    },
    studiocode: {
        type: String
    },
    folder: [
        {
            foldername: {
                type: String,
                required: [true, "Folder name is required"]
            },
            locationname: { type: String },
            indexname: { type: String },
            size: {
                type: Number,
                required: false
            },
            count: {
                type: Number,
                required: false
            },
            status: {
                type: String
            },
            uploadtime: {
                type: Date,
                default: Date.now,
            }
        },
    ],
    transfer: {
        type: String
    },
    optimise: {
        type: String
    },

}, { timeseries: true })

const Service = mongoose.model("Services", serviceSchema)

module.exports = Service