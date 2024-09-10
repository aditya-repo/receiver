const { Schema, default: mongoose } = require("mongoose")

const serviceSchema = Schema({
    clientid: {
        type: String,
        required: [true, "Client  Id should be required"],
    },
    servicename: {
        type: String,
        enum: ['invite', 'cloud', 'skinn'],
        cloud: [
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
        process: {
            type: String,
            enum: ["compressed", "decompressed", "resized", "detected", "grouped"]
        }
    }
})

const service = mongoose.model(serviceSchema, "Services")

export default service