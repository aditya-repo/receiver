const mognoose  = require("mongoose")
const Client = require("../models/clients")

const fetchFolderList = (req, res)=>{
    const {studiocode, clientid} = req.body

    const result = {mongooseresult}

    return res.status(200).json(result)
}

const fetchFileList = (req, res)=>{
    const {studiocode, clientid} = req.body

    return res.status(200).json()
}

const fetchSingleFile = (req, res)=>{

}

const newClient = (req, res)=>{
    const clientData = {
        clientId: "C12345",
        occassionname: "Wedding",
        occassiontype: "Private",
        clientname: "John Doe",
        occassiondate: new Date('d-m-Y'),
        address: "123 Main St",
        contact: 9876543210,
        studiocode: "STU456",
        venue: "ABC Banquet Hall",
        status: "inactive"
    };

    const newClient = new Client(clientData)

    newClient.save().then((user)=>console.log('User saved', user)).catch((err)=>console.log("Save failed", err))

    try {
        newClient.save()
        return res.status(200).json("New client created successfully")
    } catch (error) {
        return res.status(401).json("User creation failed :", error)
    }
    
}

const updateClient = (req, res)=>{
    
}

const allClient = (req, res)=>{
    
}

const singleClient = (req, res)=>{
    
}

const clientInfo = (req, res)=>{
    
}


module.exports = { fetchFolderList, fetchFileList, fetchSingleFile, newClient, updateClient, allClient, singleClient, clientInfo }