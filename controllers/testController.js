const Wallet = require("../models/wallet")
const Transaction = require("../models/transaction")

const createWallettoStudio = async (req, res)=>{
    try {
        const studiocode = 'ASDF1';
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
        });
        const savedTransaction = await transaction.save();
    
        // Return both the saved wallet and transaction in the response
        res.json({ wallet: savedWallet, transaction: savedTransaction });
      } catch (error) {
        console.error('Error creating wallet or transaction:', error);
        res.status(500).json({ error: 'Server error' });
      }

}

module.exports = {createWallettoStudio}