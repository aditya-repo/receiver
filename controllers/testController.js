const Wallet = require("../models/wallet")
const Service = require("../models/services")
const Transaction = require("../models/transaction")

const createWallettoStudio = async (req, res)=>{
    try {
        const studiocode = 'ASDC2';
        const amount = 5;
    
        // Create and save the wallet entry
        const wallet = new Wallet({ studiocode, amount });
        const savedWallet = await wallet.save();
    
        // Create and save the transaction entry
        const transaction = new Transaction({
          to: studiocode,
          amount,
          from: 'admin',
          type: 'credit',
          walletamount: amount
        });
        const savedTransaction = await transaction.save();
    
        // Return both the saved wallet and transaction in the response
        res.json({ wallet: savedWallet, transaction: savedTransaction });
      } catch (error) {
        console.error('Error creating wallet or transaction:', error);
        res.status(500).json({ error: 'Server error' });
      }

}

const serviceUpdateForPublicApi = async (req, res) => {
  try {
    const clientId = '2MOH6';
    const cloud = 'silver';

    const payload = {
      clientId,
      cloud,
      folder: [
        {
          foldername: "Baraat",
          size: 152, // in mb
          count: 450
        },
        {
          foldername: "Mandap",
          size: 140,
          count: 320
        },
        {
          foldername: "Varmala",
          size: 82,
          count: 167
        },
        {
          foldername: "Public",
          size: 180,
          count: 410
        },
      ]
    };

    // Find the service by clientId and update it with the new payload
    const updatedService = await Service.findOneAndUpdate(
      { clientId },         // Search by clientId
      { $set: payload },    // Set the new payload
      { new: true, upsert: true } // Return the updated document, create it if it doesn't exist
    );

    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {createWallettoStudio, serviceUpdateForPublicApi}