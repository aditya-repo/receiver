const Service = require("../models/services")

const newInvitationRequest = (req, res) => {

}

const updateInvitationRequest = (req, res) => {

}

const deleteInvitationRequest = (req, res) => {

}

const createCloudService = (req, res) => {

}

const updateCloudServiceRequest = (req, res) => {

}

const deleteCloudServiceRequest = (req, res) => {

}

const newFolder = async (req, res) => {
    const { clientid, folderName, filename, size } = req.body;

    try {
        const service = await Service.findOne({
            clientId: clientid,
            'folder.foldername': folderName,
        });

        if (service) {
            // If the folder exists
            return res.json({ found: true });
        }

        // If the folder does not exist, create it
        const newFolder = { foldername: folderName, status: 'pending', locationname: filename, size };

        await Service.findOneAndUpdate(
            { clientId: clientid },
            { $push: { folder: newFolder } },
            { new: true, upsert: true }
        );

        return res.json({ found: false });
    } catch (error) {
        console.error("Error checking or creating foldername:", error);
        return res.status(500).json({ error: "Internal server error." }); // Handle error gracefully
    }
};

const deleteFolder = (req, res) => {

}

const completeUpload = (req, res) => {

}

const fetchUpload = async (req, res)=> {
    const {clientcode} = req.params

    try {
        const service = await Service.findOne({clientId: clientcode})
        res.json(service)
    } catch (error) {
        res.json("message", error)
    }
}


module.exports = {
    completeUpload,
    deleteFolder,
    newFolder,
    deleteCloudServiceRequest,
    updateCloudServiceRequest,
    createCloudService,
    deleteInvitationRequest,
    updateInvitationRequest,
    newInvitationRequest,
    fetchUpload
}