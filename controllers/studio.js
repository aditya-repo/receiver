const Client = require("../models/clients")
const ProUser = require("../models/pro-user")
const Service = require("../models/services")
const Wallet = require("../models/wallet")
const createUniqueClientID = require("../services/uniqueclient")

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
    const studiocode = req.user.body

    // console.log(req.user);
    
    const clientdata = await Client.find({isdeleted: false, studiocode}).sort({createdAt: -1})
    res.status(200).json(clientdata)
}

const newClient = async (req, res)=>{

    const studiocode = req.user.username

    console.log(req.body);

    const newClientID = await createUniqueClientID()
    const { projectName, bookingDate, clientName, contact, venue, type, description } = req.body
    
    const clientData = {clientId: newClientID, occassionname : projectName, occassiontype: type, clientname: clientName, occassiondate: bookingDate, contact, venue, studiocode, status: "0", description};
    const newClient =  new Client(clientData)
    newClient.save().then((user)=>console.log('User saved', user)).catch((err)=>console.log("Save failed", err))

}

const updateClient = async (req, res)=>{

    const {clientcode} = req.params
    const {occassioname, occassiontype, clientName, occassiondate, address, contact, venue, description} = req.body

    
    const clientdata = await Client.findOneAndUpdate({clientId: clientcode}, {occassioname, occassiontype, clientname: clientName, occassiondate, address, contact, venue, description }, { new: true } )

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
    const clientdata = await Client.findOne({ clientId: clientcode, isdeleted: false })
    
    // console.log(clientdata);
    
    res.status(200).json(clientdata)

    
}

const getDashboard = async (req, res)=>{

    const studiocode = req.user.username  

    const totalClient = await Client.find({isdeleted: false}).sort({createdAt: -1})

    const activeClient = totalClient.filter((data)=> data.status === '1').length

    const credit = await Wallet.findOne({studiocode})

    const payload = {
        totalClient: totalClient.length,
        activeClient,
        credit : credit.amount,
        clientdetail: totalClient
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

const getService = async (req, res)=>{
    const {clientcode} = req.params

    console.log(clientcode);
    

    const response = await Service.findOne({clientId: clientcode})
    console.log(response);


    res.status(200).json(response)
}

const updateService = async (req, res)=> {
    const {clientcode} = req.params
    const {packagetype} = req.body

    let response = await Service.findOne({clientId: clientcode})

    console.log(req.body)            

    if (response == null) {
        const newService = new Service({clientId: clientcode, cloud: packagetype})
        const response = newService.save()
        return res.status(200).json(response)
    }

    response = await Service.findOneAndUpdate({clientId: clientcode}, {cloud: packagetype}, {new: true})
    res.json(response).status(200)
}

const getPublic = async(req, res)=>{
    const {clientcode} = req.params

    const response = await Service.findOne({clientId: clientcode})

    res.status(200).json(response)

}



module.exports = { fetchFolderList, fetchFileList, fetchSingleFile, newClient, updateClient, allClient, singleClient, getDashboard, deleteClient, deletedClient, deleteProUser, getProUsers, getService, updateService, getPublic }