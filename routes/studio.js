const express = require("express");
const {
  getDashboard,
  allClient,
  updateClient,
  singleClient,
  deletedClient,
  deleteClient,
  getProUsers,
  deleteProUser,
  newClient,
  getService,
  updateService,
  getPublic,
} = require("../controllers/studio");
const {
  fetchUpload,
  deleteFolder,
  finalaction,
} = require("../controllers/service");
const cpuMiddleware = require("../services/cpuusage");
const app = express();

app.route("/").get(getDashboard);
app.route("/clients").get(allClient).delete(deletedClient);
app.route("/client").post(newClient);
app
  .route("/client/:clientcode")
  .get(singleClient)
  .post(updateClient)
  .delete(deleteClient);
app.route("/prouser/:studio").get(getProUsers).delete(deleteProUser);
app.route("/service/:clientcode").get(getService).post(updateService);
app.route("/public/:clientcode").get(getPublic);

// app.use(cpuMiddleware)

app.route("/upload-data/:clientcode").get(fetchUpload).post(deleteFolder);
app.route("/decompress/:clientcode").post(finalaction);

module.exports = app;
