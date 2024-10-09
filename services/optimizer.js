const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const tar = require("tar");
const Unrar = require("node-unrar-js");
const seven = require("node-7z");
const rimraf = require("rimraf");
const { performance } = require("perf_hooks");

/**
 * Decompress files from the input folder to the output folder while maintaining the structure.
 * @param {string} compressedFolder - Path to the input folder containing compressed files.
 * @param {string} outputFolder - Path to the output folder where decompressed files will be stored.
 */
async function processCompressedFiles(compressedFolder, outputFolder) {
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

  const endTime = performance.now();
  console.log(
    `All files processed successfully! Time taken: ${(endTime - startTime) / 1000} seconds`
  );
}

async function handleCompressedFile(filePath, outputFolder) {
  const folderName = path.basename(filePath, path.extname(filePath));
  const tempOutputFolder = path.join(outputFolder, folderName);

  try {
    await decompressFile(filePath, tempOutputFolder);
    fs.unlinkSync(filePath); // Remove compressed file after decompression
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
  let vidCounter = 1;

  files.forEach((file) => {
    const filePath = path.join(baseFolder, file);
    const ext = path.extname(file).toLowerCase();
    let newFileName;

    if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      newFileName = `IMG_${folderName}_${imgCounter.toString().padStart(4, "0")}${ext}`;
      imgCounter++;
    } else if ([".mp4", ".avi", ".mov", ".mkv"].includes(ext)) {
      newFileName = `VID_${folderName}_${vidCounter.toString().padStart(3, "0")}${ext}`;
      vidCounter++;
    } else {
      return; // Skip non-image/video files
    }

    const newFilePath = path.join(baseFolder, newFileName);
    fs.renameSync(filePath, newFilePath);
  });
}


module.exports = processCompressedFiles;
