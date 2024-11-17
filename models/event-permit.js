const { Schema, default: mongoose } = require("mongoose")

const eventPermitSchema = new Schema({
    eventid:{
        type: String
    },
    eventowner:{
        type: String
    },
    followers: [
      {
        userid: {
          type: String,
          required: true, 
        },
        permission: {
          type: Boolean,
          default: false,
        },
      },
    ],

}, { timestamp : true })

const EventPermit = mongoose.model("EventPermit", eventPermitSchema)

module.exports = EventPermit