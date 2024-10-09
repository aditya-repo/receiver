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

// Function to rename all files in a folder with a counter
const renameFilesInFolder = async (folderPath) => {
  let  map = {} // Initialize map as an object
  try {
    const files = await fs.promises.readdir(folderPath); // Use async readdir
    for (let i = 0; i < files.length; i++) {
      const oldFilePath = path.join(folderPath, files[i]);
      const newFileName = `${i + 1}${path.extname(files[i])}`; // New file name with counter
      const newFilePath = path.join(folderPath, newFileName);
      await fs.promises.rename(oldFilePath, newFilePath); // Rename the file

      console.log(files[i]);

      // Correctly assign old file name to new file name in map
      map[files[i]] = newFileName;
    }
    // console.log(`Renamed all files in folder: ${folderPath}`);
  } catch (err) {
    console.error(`Error renaming files in folder: ${folderPath}`, err);
  }
  return map; // Return the mapping
};

// Main function to loop through all folders, assemble chunks, and remove old files
const assembleAllFolders = async (mainFolderPath, newMainFolderPath) => {
  const folders = getFolders(mainFolderPath);

  let value;

  // Create the new main folder if it doesn't exist
  createDirectory(newMainFolderPath);

  for (const folder of folders) {
    const folderPath = path.join(mainFolderPath, folder);

    // Path for the final assembled file in the new folder
    const finalFilePath = path.join(newMainFolderPath, `${folder}`); // Change extension as needed

    await assembleChunks(folderPath, finalFilePath);

    // Remove the old folder after assembling
    try {
      fs.rmdirSync(folderPath);
    } catch (err) {
      console.error(`Error removing folder: ${folderPath}`, err);
    }

    // Rename files in the new folder
    value = await renameFilesInFolder(newMainFolderPath); // Rename files in the new folder
    
  }
  return value
};

// Example usage
const bundling = async (mainFolderPath, newMainFolderPath) => {
  return await assembleAllFolders(mainFolderPath, newMainFolderPath);
};

module.exports = bundling;
