const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");
const databaseConnection = require("./models");
require("dotenv").config();

const adminRouter = require("./routes/admin");
const studioRouter = require("./routes/studio");
const cronjobRouter = require("./routes/cronjob")
const publicRouter = require("./routes/public")
const { adminSignin, studioSignin, sendOTP, verifyOTP } = require("./controllers/auth");
const { adminAuth, studioAuth } = require("./middlewares/auth");
const {
  createWallettoStudio,
  serviceUpdateForPublicApi,
} = require("./controllers/testController");
const { validateLogin } = require("./middlewares/loginvalidator");
const { newFolder } = require("./controllers/service");

const DATABSE_URL = process.env.DATABASE;

const app = express();
app.use(cors());
app.use(express.json()); 

// Database connection
databaseConnection(DATABSE_URL);

// Temporary storage for chunks
const upload = multer({ dest: "uploads/temp" });

app.use('/images', express.static('../images'));

app.post("/admin-login", validateLogin, adminSignin);
app.post("/login", studioSignin);
app.use("/admin", adminAuth, adminRouter);
app.use("/studio", studioAuth, studioRouter);
app.use("/manual", cronjobRouter)
app.use("/public", publicRouter)

app.get("/create-wallet", createWallettoStudio);
app.get("/public-test", serviceUpdateForPublicApi);

// Endpoint to check which chunks have been uploaded
app.post("/upload/check", async (req, res) => {
  const { fileName, totalChunks, clientid } = req.body;

  const tempDir = path.join(__dirname, "uploads", "temp", clientid, fileName);

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

app.post("/upload/folder", newFolder);

// Endpoint to upload a chunk
app.post("/upload", upload.single("chunk"), async (req, res) => {
  const { fileName, chunkIndex, clientid } = req.body;

  const tempDir = path.join(__dirname, "uploads", "temp", clientid, fileName);
  await fs.ensureDir(tempDir); // Ensure the temp directory exists for storing chunks

  const chunkPath = path.join(tempDir, `${chunkIndex}`);
  await fs.move(req.file.path, chunkPath, { overwrite: true });

  res.status(200).send(`Chunk ${chunkIndex} uploaded`);
});

app.listen(4000, () => console.log("Server started on port 4000"));
