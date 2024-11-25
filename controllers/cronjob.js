
const { exec } = require('child_process');
const path = require('path');
const taskFilePath = path.join(__dirname, '..', 'cdn-transfer', 'main.js');

const cdnTransfer = (req, res) => {

  exec(`node ${taskFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing task: ${error}`);
      return res.status(500).send('Error running the task.');
    }
    console.log(`Task output: ${stdout}`);
    res.send(`Task completed: ${stdout}`);
  });
}

// Get the full path of task.py
const pythonFilePath = path.join(__dirname, '..', '..', 'queued-compression', 'main.py');

// API endpoint to trigger the Python task
const imageReducer = (req, res) => {
  // Execute the Python task and wait for it to finish
  exec(`python3 ${pythonFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python task: ${error.message}`);
      return res.status(500).send('Error executing Python task.');
    }
    console.log(`Python task output: ${stdout}`);
    res.send('Python task completed successfully!');
  });
}

module.exports = { cdnTransfer, imageReducer }