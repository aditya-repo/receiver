const mognoose  = require("mongoose")

const fetchFolderList = (req, res)=>{
    const {studiocode, clientid} = req.body

    const result = {mongooseresult}

    return res.status(200).json(result)
}

const fetchFileList = (Req, res)=>{
    const {studiocode, clientid} = req.body

    return res.status(200).json()
}

// const signup