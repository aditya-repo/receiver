const Service = require("../models/services");
const path = require("path");
require("dotenv").config()

const VPS2 = process.env.VPS2

const bundling = require("../services/bundling");
const processCompressedFiles = require("../services/optimizer");
const rsyncTransfer = require("../services/rsync");

const newInvitationRequest = (req, res) => { };

const updateInvitationRequest = (req, res) => { };

const deleteInvitationRequest = (req, res) => { };

const createCloudService = (req, res) => { };

const updateCloudServiceRequest = (req, res) => { };

const deleteCloudServiceRequest = (req, res) => { };

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

const completeUpload = (req, res) => { };

const fetchUpload = async (req, res) => {
  const { clientcode } = req.params;

  try {
    const service = await Service.findOne({ clientId: clientcode });

    console.log(service);


    res.json(service);
  } catch (error) {
    res.json("message", error);
  }
};

const finalaction = async (req, res) => {
  const { clientcode } = req.params;

  const inputPath = path.join(__dirname, "..", "uploads", "temp", clientcode);
  const assembledPath = path.join(__dirname, "..", "assembled", clientcode);
  const optimizedFilePath = path.join(__dirname, "..", "optimized", clientcode);
  const finalPath = path.join(__dirname, "..", "final", clientcode);
  const vps2path = VPS2

  try {
    const data = await bundling(inputPath, assembledPath); // Wait for bundling to complete
    console.log("Bundling completed.");

    const folderdata = await Service.findOne({ clientId: clientcode }).lean();

    // Update the folder array with the new indexname
    folderdata.folder.forEach(folder => {
      const locationName = folder.locationname;
      folder.indexname = data[locationName] !== undefined ? data[locationName] : folder.indexname;
    });

    // Update the client document with the modified folder array
    await Service.updateOne({ clientId: clientcode }, { $set: { folder: folderdata.folder, optimise: 'in-progress' } });


    // Proceed to process compressed files only after bundling is completed
    const countData = await processCompressedFiles(assembledPath, optimizedFilePath, finalPath);

    // Assuming countData is in the form of { '1': 20, '2': 256, ... } where '1', '2', etc. are indexnames
    folderdata.folder.forEach(folder => {
      const indexName = folder.indexname; // Use indexname to match the countData

      // Check if countData has a count for the current indexname and update the count
      folder.count = countData[indexName] !== undefined ? countData[indexName] : folder.count;
    });

    await Service.updateOne(
      { clientId: clientcode }, 
      { $set: { folder: folderdata.folder, transfer: 'in-progress', optimise: 'completed' } }
    );

    rsyncTransfer(finalPath, vps2path, clientcode); // Initiate transfer and continue

    // Send a success response if needed
    res.status(200).send({ message: "All actions completed successfully." });
  } catch (err) {
    console.error("Error:", err);
    // Handle the error and send a response
    res.status(500).send({ error: "An error occurred during processing." });
  }
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
