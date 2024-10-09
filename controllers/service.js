const Service = require("../models/services");
const bundling = require("../services/bundling");

const newInvitationRequest = (req, res) => {};

const updateInvitationRequest = (req, res) => {};

const deleteInvitationRequest = (req, res) => {};

const createCloudService = (req, res) => {};

const updateCloudServiceRequest = (req, res) => {};

const deleteCloudServiceRequest = (req, res) => {};

const newFolder = async (req, res) => {
  const { clientid, folderName, filename, size } = req.body;

  try {
    const service = await Service.findOne({
      clientId: clientid,
      "folder.foldername": folderName,
    });

    if (service) {
      // If the folder exists
      return res.json({ found: true });
    }

    // If the folder does not exist, create it
    const newFolder = {
      foldername: folderName,
      status: "pending",
      locationname: filename,
      size,
    };

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

const deleteFolder = async (req, res) => {
  const { id } = req.body;
  const { clientcode } = req.params;

  try {
    const result = await Service.findOneAndUpdate(
      { clientId: clientcode },
      { $pull: { folder: { _id: id } } },
      { new: true }
    );

    if (result) {
      res.status(200).json({ message: "Folder deleted successfully", result });
    } else {
      res.status(404).json({ message: "Folder or Client not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting folder", error });
  }
};

const completeUpload = (req, res) => {};

const fetchUpload = async (req, res) => {
  const { clientcode } = req.params;

  try {
    const service = await Service.findOne({ clientId: clientcode });
    res.json(service);
  } catch (error) {
    res.json("message", error);
  }
};

const finalaction = (req, res) => {
  const { clientcode } = req.params;

  bundling(clientcode);
};

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
  fetchUpload,
  finalaction,
};
