const Client = require("../models/clients");

// Function to generate a random 5-character client ID
const generateClientID = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let clientID = '';
    for (let i = 0; i < 5; i++) {
      clientID += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return clientID;
  };
  
  // Function to check if client ID exists and create a new one if needed
  const createUniqueClientID = async () => {
    let isUnique = false;
    let newClientID = '';
  
    while (!isUnique) {
      newClientID = generateClientID();
      const existingClient = await Client.findOne({ clientId: newClientID });
  
      if (!existingClient) {
        isUnique = true;
        return newClientID
      }
    }
  }
  
    module.exports = createUniqueClientID