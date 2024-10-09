const fs = require("fs");
const path = require("path");

// Function to get the folders inside the main folder
const getFolders = (folderPath) => {
  return fs.readdirSync(folderPath).filter((file) => {
    return fs.statSync(path.join(folderPath, file)).isDirectory();
  });
};

// Function to create directories recursively
const createDirectory = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Function to assemble chunks into the final file and remove the chunks
const assembleChunks = async (folderPath, finalFilePath) => {
  try {
    const chunks = fs
      .readdirSync(folderPath)
      .filter((file) => file.match(/^\d+$/)) // Match numeric files (chunk files)
      .sort((a, b) => a - b); // Sort chunks in numerical order

    const writeStream = fs.createWriteStream(finalFilePath);

    // Handle errors for writeStream
    writeStream.on("error", (err) => {
      console.error(`Error writing to final file: ${finalFilePath}`, err);
    });

    for (const chunk of chunks) {
      const chunkPath = path.join(folderPath, chunk);

      try {
        const chunkData = await fs.promises.readFile(chunkPath);
        writeStream.write(chunkData);

        // Remove the chunk after writing
        await fs.promises.unlink(chunkPath);
      } catch (readError) {
        console.error(`Error processing chunk: ${chunkPath}`, readError);
        writeStream.destroy(); // Close the stream on error
        return;
      }
    }

    // Close the writeStream when done
    writeStream.end(() => {
      console.log(`Assembled file created at: ${finalFilePath}`);
    });
  } catch (err) {
    console.error(`Failed to assemble chunks in folder: ${folderPath}`, err);
  }
};

// Main function to loop through all folders, assemble chunks, and remove old files
const assembleAllFolders = async (mainFolderPath, newMainFolderPath) => {
  const folders = getFolders(mainFolderPath);

  // Create the new main folder if it doesn't exist
  createDirectory(newMainFolderPath);

  for (const folder of folders) {
    const folderPath = path.join(mainFolderPath, folder);

    // Path for the final assembled file in the new folder
    const finalFilePath = path.join(newMainFolderPath, `${folder}`); // Change extension as needed

    // console.log(`Assembling chunks in folder: ${folder}`);
    await assembleChunks(folderPath, finalFilePath);

    // Remove the old folder after assembling
    try {
      fs.rmdirSync(folderPath);
    } catch (err) {
      console.error(`Error removing folder: ${folderPath}`, err);
    }
  }
};

// Example usage
const bundling = async (clientid) => {
  // Original directory where folders with chunks are located
  const mainFolderPath = path.join(
    __dirname,
    "..",
    "uploads",
    "temp",
    clientid
  );

  // New directory to store the final assembled files
  const newMainFolderPath = path.join(__dirname, "..", "assembled", clientid);

  // Run the assembler
  await assembleAllFolders(mainFolderPath, newMainFolderPath);
};

module.exports = bundling;
