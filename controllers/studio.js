const Client = require("../models/clients")
const ProUser = require("../models/pro-user")
const Wallet = require("../models/wallet")

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

const allClient = async (req, res)=>{

    const clientdata = await Client.find({isdeleted: false})
    res.status(200).json(clientdata)
}

const newClient = (req, res)=>{

    const {studiocode} = req.params

    const { occassioname, occassiontype, clientname, occassiondate, address, contact, venue } = req.body

    const clientData = {occassioname, occassiontype, clientname, occassiondate, address, contact, venue, studiocode, status: "0"};

    const newClient = new Client(clientData)

    newClient.save().then((user)=>console.log('User saved', user)).catch((err)=>console.log("Save failed", err))

    try {
        newClient.save()
        return res.status(200).json("New client created successfully")
    } catch (error) {
        return res.status(401).json("User creation failed :", error)
    }
    
}

const updateClient = async (req, res)=>{

    const {clientcode} = req.params
    const {occassioname, occassiontype, clientname, occassiondate, address, contact, venue} = req.body
    const clientdata = await Client.findOneAndUpdate({clientcode}, {occassioname, occassiontype, clientname, occassiondate, address, contact, venue }, { new: true } )

    res.json({ message: 'Update successful', data: clientdata });
}

const deleteClient = async (req, res)=>{
    const { clientcode } = req.params
    const clientdata = await Client.findOneAndUpdate({clientcode}, { isdeleted: false }, { new: true })

    res.status(200).json({message: "Deleted successful", data: clientdata})
}

const deletedClient = async (req, res)=>{
    const clientdata = await Client.find({isdeleted: true})
}

const singleClient = async (req, res)=>{

    const { clientcode } = req.params
    const clientdata = await Client.findOne({ clientcode })
    res.status(200).json(clientdata)

    
}

const getDashboard = async (req, res)=>{

    const totalClient = await Client.find({isdeleted: false})

    const activeClient = totalClient.filter((data)=> data.status === '1').length

    const credit = await Wallet.find({studiocode})

    const payload = {
        totalClient,
        activeClient,
        credit
    }

    res.status(200).json(payload)
    
}

const getProUsers = async (req, res)=>{
    const {studiocode} = req.params 

    const response = await ProUser.find({studiocode})
    res.status(200).json(response)
}

const deleteProUser = async (req, res)=>{
    const { studiocode} = req.params
    const {clientcode} = req.body

    const response = await ProUser.findOneAndDelete({studiocode, clientcode}, {new: true})

    res.status(200).json(response)
}

module.exports = { fetchFolderList, fetchFileList, fetchSingleFile, newClient, updateClient, allClient, singleClient, clientInfo, getDashboard, deleteClient, deletedClient, deleteProUser, getProUsers }