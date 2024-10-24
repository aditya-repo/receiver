const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const tar = require("tar");
const Unrar = require("node-unrar-js");
const seven = require("node-7z");
const rimraf = require("rimraf");
const { performance } = require("perf_hooks");

const archiver = require('archiver');

/**
 * Decompress files from the input folder to the output folder while maintaining the structure.
 * @param {string} compressedFolder - Path to the input folder containing compressed files.
 * @param {string} outputFolder - Path to the output folder where decompressed files will be stored.
 */
async function processCompressedFiles(compressedFolder, outputFolder, finalPath) {
  const startTime = performance.now();

  // Ensure output main folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const files = fs.readdirSync(compressedFolder);
  for (const file of files) {
    const filePath = path.join(compressedFolder, file);
    await handleCompressedFile(filePath, outputFolder);
  }

  const countobject = getFolderFileCounts(outputFolder)


  // await zipFolder(outputFolder, finalPath);

  const endTime = performance.now();
  console.log(
    `All files processed successfully! Time taken: ${(endTime - startTime) / 1000} seconds`
  );
  return countobject
}

async function handleCompressedFile(filePath, outputFolder) {
  const folderName = path.basename(filePath, path.extname(filePath));
  const tempOutputFolder = path.join(outputFolder, folderName);

  try {
    await decompressFile(filePath, tempOutputFolder);
    fs.unlinkSync(filePath);
    mergeFolders(tempOutputFolder);
    renameFiles(tempOutputFolder, folderName);
  } catch (err) {
    console.error(`Error handling file ${filePath}:`, err);
  }
}

function decompressFile(filePath, outputPath) {
  const fileExt = path.extname(filePath).toLowerCase().slice(1);

  switch (fileExt) {
    case "zip":
      return decompressZip(filePath, outputPath);
    case "tar":
    case "gz":
    case "bz2":
      return decompressTar(filePath, outputPath);
    case "rar":
      return decompressRar(filePath, outputPath);
    case "7z":
      return decompress7z(filePath, outputPath);
    default:
      console.log("Unsupported file format:", fileExt);
      return Promise.reject(new Error("Unsupported file format"));
  }
}

function decompressZip(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(unzipper.Extract({ path: outputPath }))
      .on("close", () => {
        console.log("Zip file decompressed successfully.");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error decompressing zip file:", err);
        reject(err);
      });
  });
}

function decompressTar(filePath, outputPath) {
  return tar
    .x({
      file: filePath,
      C: outputPath,
    })
    .then(() => {
      console.log("Tar file decompressed successfully.");
    })
    .catch((err) => {
      console.error("Error decompressing tar file:", err);
    });
}

function decompressRar(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    const data = fs.readFileSync(filePath);
    const extractor = Unrar.createExtractorFromData(data);
    const extracted = extractor.extractAllTo(outputPath);

    if (extracted[0].state === "SUCCESS") {
      console.log("Rar file decompressed successfully.");
      resolve();
    } else {
      console.error("Failed to decompress Rar file.");
      reject(new Error("Failed to decompress Rar file."));
    }
  });
}

function decompress7z(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    const myStream = seven.extractFull(filePath, outputPath, {
      $bin: "path/to/7z.exe", // Adjust this if necessary
    });

    myStream
      .on("end", () => {
        console.log("7z file decompressed successfully.");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error decompressing 7z file:", err);
        reject(err);
      });
  });
}

function mergeFolders(baseFolder) {
  if (!fs.existsSync(baseFolder)) {
    console.warn(`Base folder ${baseFolder} does not exist.`);
    return;
  }

  const items = fs.readdirSync(baseFolder);

  items.forEach((item) => {
    const itemPath = path.join(baseFolder, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const nestedItems = fs.readdirSync(itemPath);
      nestedItems.forEach((nestedItem) => {
        const nestedItemPath = path.join(itemPath, nestedItem);
        const newItemPath = path.join(baseFolder, nestedItem);
        fs.renameSync(nestedItemPath, newItemPath);
      });
      rimraf.sync(itemPath); // Remove the now-empty nested folder
    }
  });
}

function renameFiles(baseFolder, folderName) {
  if (!fs.existsSync(baseFolder)) {
    console.warn(`Base folder ${baseFolder} does not exist.`);
    return;
  }

  const files = fs.readdirSync(baseFolder);
  let imgCounter = 1;

  files.forEach((file) => {
    const filePath = path.join(baseFolder, file);
    const ext = path.extname(file).toLowerCase();
    let newFileName;

    // Keep only image files (jpg, jpeg, png, gif)
    if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      newFileName = `IMG_${folderName}_${imgCounter.toString().padStart(4, "0")}${ext}`;
      imgCounter++;
      const newFilePath = path.join(baseFolder, newFileName);
      fs.renameSync(filePath, newFilePath);
    } else {
      // Remove all other files, including videos
      console.log(`Deleting non-image file: ${file}`);
      fs.unlinkSync(filePath);
    }
  });
}


// Get the count and create ajavascript for total file
function getFolderFileCounts(mainFolderPath) {
  const folderCounts = {};

  // Read the contents of the main folder
  const folders = fs.readdirSync(mainFolderPath, { withFileTypes: true });

  // Loop through each item in the main folder
  folders.forEach((folder) => {
    // Check if the item is a directory
    if (folder.isDirectory()) {
      const folderPath = path.join(mainFolderPath, folder.name);
      // Count the files in the subfolder
      const files = fs.readdirSync(folderPath);
      folderCounts[folder.name] = files.length; // Store folder name and file count
    }
  });

  return folderCounts;
}


function zipFolder(inputFolder, outputZipFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipFile);
    const archive = archiver('zip', { zlib: { level: 9 } }); // Maximum compression

    output.on('close', () => {
      console.log(`Zipped ${archive.pointer()} total bytes. Zipping completed successfully.`);

      // Remove the input directory after zipping is completed
      fs.rm(inputFolder, { recursive: true, force: true }, (err) => {
        if (err) {
          return reject(`Failed to delete folder: ${err.message}`);
        }
        console.log(`${inputFolder} directory deleted successfully.`);
        resolve();
      });
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(inputFolder, false);
    archive.finalize();
  });
}

module.exports = processCompressedFiles;
