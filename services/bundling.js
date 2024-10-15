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

const renameFilesInFolder = async (folderPath) => {
  let map = {}; // Initialize map as an object
  try {
    const files = await fs.promises.readdir(folderPath); // Use async readdir

    // First, create the mapping with old and new names
    for (let i = 0; i < files.length; i++) {
      const oldFileName = files[i];
      const newFileName = `${i + 1}${path.extname(oldFileName)}`; // New file name with counter
      
      // Store both old and new file names in the map
      map[oldFileName] = newFileName; // Direct assignment of new file name
    }

    // Then rename the files based on the map
    for (const [oldFileName, newFileName] of Object.entries(map)) {
      const oldFilePath = path.join(folderPath, oldFileName);
      const newFilePath = path.join(folderPath, newFileName);
      await fs.promises.rename(oldFilePath, newFilePath); // Rename the file
    }
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

// Get the old folder and new folder name object
const getFoldersWithIndex = async (mainFolder) => {
  try {
    // Read all entries in the main folder
    const entries = await fs.promises.readdir(mainFolder, { withFileTypes: true });
    
    // Use reduce to create the folder mapping object
    const folderMap = entries.reduce((acc, entry, index) => {
      if (entry.isDirectory()) {
        acc[entry.name] = index + 1; // Map folder name to its index (1-based)
      }
      return acc; // Return accumulator
    }, {});

    return folderMap; // Return the folder mapping object
  } catch (err) {
    console.error(`Error reading folder: ${mainFolder}`, err);
    return {}; // Return an empty object on error
  }
};

// Example usage
const bundling = async (mainFolderPath, newMainFolderPath) => {
  const folders = await getFoldersWithIndex(mainFolderPath);
  await assembleAllFolders(mainFolderPath, newMainFolderPath);
  console.log(folders);
  
  return folders
};

module.exports = bundling;
