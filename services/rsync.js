const { exec } = require('child_process');
const Service = require('../models/services');

function rsyncTransfer(source, destination, clientcode) {


    const rsyncCommand = `rsync -avzP ${source} ${destination}`;
  

  // Start the rsync process
  exec(rsyncCommand, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing rsync: ${error.message}`);

      // Update transfer status to "failed" in Service model
      await Service.findOneAndUpdate(
        { clientId: clientcode },
        { $set: { transfer: 'failed' } }
      );
      return;
    }

    if (stderr) {
      console.error(`Rsync stderr: ${stderr}`);
    }

    console.log(`Rsync stdout: ${stdout}`);

    // After rsync finishes, update transfer status to "completed"
    await Service.findOneAndUpdate(
      {clientId: clientcode },
      { $set: { transfer: 'completed' } }
    );

    console.log('Finished'); // Transfer complete message
  });
  }
  
  module.exports = rsyncTransfer