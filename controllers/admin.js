const Studio = require("../models/studios")

const allStudio = (req, res)=>{

}

const getDashboardDetails = async (req, res)=>{

    const result = await Studio.find()
    
    res.status(200).json(result)
}

const singleStudio = (req, res)=>{

}

const updateStudio = (req, res)=>{

}

const allClient = (req, res)=>{
    
}

const singleClient = (req, res)=>{

}

const updateClient = (req, res)=>{

}

const deleteStudio = (req, res)=>{

}

const pauseStudioService = (req, res)=>{

}

const updateCreditCount = (req, res)=>{

}

const cloudStatus = (req, res)=>{

}

const serviceInfo = (req, res)=>{

}

const photographerData = (req, res)=>{

}

const clientData = (req, res)=>{

}

const userData = (req, res)=>{

}

const serviceDurationExtension = (req, res)=>{
    
}

module.exports = {
    getDashboardDetails
}