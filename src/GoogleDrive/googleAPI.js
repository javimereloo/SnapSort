const fs = require("fs");
const { google } = require("googleapis");
const API = require("../database/API.js");

const credentials = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key.replace(/\\n/g, '\n'),
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url
}
      
const auth = new google.auth.GoogleAuth({
  credentials: (credentials),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

async function getFilesInFolder(folderUrl, clientIp) {
  const drive = google.drive({
    version: "v3",
    auth,
    params: { userIp: clientIp },
  });
  const folderId = folderUrl.match(/[-\w]{25,}/);
  //If the folder ID cannot be extracted, it throws an error.
  if (!folderId) {
    throw new Error("La URL de la carpeta es incorrecta");
  }

  // Gets the files from the folder
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, webContentLink, webViewLink)",
    pageSize: 1000,
  });

  // Returns the list of files
  return res.data.files;
}

async function listFilesInFolder(urlFolder, importID, clientIp) {
  getFilesInFolder(urlFolder, clientIp)
    .then((files) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const urlSRC = file.webContentLink.replace(/&export=download/g, "");
        API.insertNewImage(importID, urlSRC, file.name);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
module.exports = {
  listFilesInFolder,
};
