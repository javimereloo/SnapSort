const fs = require('fs');
const { google } = require('googleapis');

const credentials = require(process.env.GOOGLE_DRIVE_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

async function getFilesInFolder(folderUrl) {
  const folderId = folderUrl.match(/[-\w]{25,}/);

  //If the folder ID cannot be extracted, it throws an error.
  if (!folderId) {
    throw new Error('La URL de la carpeta es incorrecta');
  }

  // Gets the files from the folder
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, webContentLink)',
  });

  // Returns the list of files
  return res.data.files;
}

async function listFilesInFolder(urlFolder){
  getFilesInFolder(urlFolder)
  .then((files) => {
    console.log(files);
    //Parsear el webContentLink
    
    //Extraer el nombre 
    //insertar en la BD
    
  })
  .catch((err) => {
    console.error(err);
  });
  
}
module.exports = {
  listFilesInFolder,
};