const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON bodies

// Temporary storage for chunks
const upload = multer({ dest: "uploads/temp" });

// Endpoint to check which chunks have been uploaded
app.post("/upload/check", async (req, res) => {
  const { fileName, totalChunks } = req.body;
  const tempDir = path.join(__dirname, "uploads", "temp", fileName);

  // Ensure the temporary directory exists
  await fs.ensureDir(tempDir);

  // Check which chunks have already been uploaded
  const uploadedChunks = [];
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(tempDir, `${i}`);
    if (await fs.pathExists(chunkPath)) {
      uploadedChunks.push(i);
    }
  }

  res.status(200).json({ uploadedChunks });
});

// Endpoint to upload a chunk
app.post("/upload", upload.single("chunk"), async (req, res) => {
  const { fileName, chunkIndex } = req.body;

  const tempDir = path.join(__dirname, "uploads", "temp", fileName);
  await fs.ensureDir(tempDir); // Ensure the temp directory exists for storing chunks

  const chunkPath = path.join(tempDir, `${chunkIndex}`);
  await fs.move(req.file.path, chunkPath, { overwrite: true });

  res.status(200).send(`Chunk ${chunkIndex} uploaded`);
});

app.listen(4000, () => console.log("Server started on port 4000"));
