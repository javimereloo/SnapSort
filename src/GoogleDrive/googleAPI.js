const fs = require('fs');
const { google } = require('googleapis');

const credentials = require('../../credentials.json');
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

async function getFilesInFolder(folderUrl) {
  const folderId = folderUrl.match(/[-\w]{25,}/);

  // Si no se puede extraer el ID de la carpeta, lanza un error
  if (!folderId) {
    throw new Error('La URL de la carpeta es incorrecta');
  }

  // Obtiene los archivos de la carpeta
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, webContentLink, webViewLink)',
  });

  // Retorna la lista de archivos
  return res.data.files;
}

async function listFilesInFolder(urlFolder){
  getFilesInFolder(urlFolder)
  .then((files) => {
    console.log(files);
  })
  .catch((err) => {
    console.error(err);
  });
  
}
//Getting folder files
// async function listFilesInFolder(urlFolder){
//   const start = urlFolder.indexOf("/folders/") + "/folders/".length;
//   const end = urlFolder.indexOf("?");
//   const folderId = urlFolder.substring(start,end);
  
//   try {
//     const res = await drive.files.list({
//       q: `'${folderId}' in parents and trashed = false`,
//       fields: 'files(id, name)',
//       auth,
//     });
//     console.log( res.data.files);
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// }


//------------------------------------------------------------------------------------------
//GOOGLE DRIVE API
// const { google } = require("googleapis");
// const { OAuth2 } = google.auth;
// const drive = google.drive("v3");
// const readline = require("readline");
// const fs = require("fs");

// // Define las credenciales de autenticación
// const credentials = {
//   client_id: process.env.GOOGLE_CLIENT_ID,
//   client_secret: process.env.GOOGLE_CLIENT_SECRET,
//   redirect_uris: ["https://snapsort.glitch.me/home"],
// };

// // Crea un objeto OAuth2 y configura las credenciales
// const oAuth2Client = new OAuth2(
//   credentials.client_id,
//   credentials.client_secret,
//   credentials.redirect_uris[0]
// );
// // Define el alcance de autorización que necesitas
// const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

// // Función que maneja la autorización
// async function authorize() {
//   // Obtén el token de autorización de la cache o solicita uno nuevo
//   try {
//     const token = fs.readFileSync("TOKEN_PATH");
//     oAuth2Client.setCredentials(JSON.parse(token));
//     return oAuth2Client;
//   } catch (err) {
//     return getNewToken(oAuth2Client);
//   }
// }

// // Función que solicita un nuevo token de autorización
// async function getNewToken(oAuth2Client) {
//   // Crea una URL de autorización y solicita el token
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });
//   console.log(`Abre esta URL en tu navegador: ${authUrl}`);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   const code = await new Promise((resolve) => {
//     rl.question("Introduce el código de autorización: ", (code) => {
//       rl.close();
//       resolve(code);
//     });
//   });
//   const { tokens } = await oAuth2Client.getToken(code);
//   oAuth2Client.setCredentials(tokens);
//   fs.writeFileSync("TOKEN_PATH", JSON.stringify(tokens));
//   console.log("Token de autorización guardado en la cache.");
//   return oAuth2Client;
// }

//------------------------------------------------------------------------------------------------

// //Import google API to access to folders and files
// const { google } = require('googleapis');
// const auth = new google.auth.GoogleAuth({
//   // keyFile: process.env.GOOGLE_CREDENTIALS_PATH,
//   scopes: ['https://www.googleapis.com/auth/drive.readonly'],
// });
// const drive = google.drive({ version: 'v3', auth });
// //Getting folderID
// function getFolderId(url) {
//   const start = url.indexOf("/folders/") + "/folders/".length;
//   const end = url.indexOf("?");
//   return url.substring(start, end);
// }
// //Getting folder files
// async function listFilesInFolder(urlFolder) {
//   const folderId = getFolderId(urlFolder);

//   const folderMetadata = await drive.files.get({
//     fileId: folderId,
//     fields: "name, files(id, name, webViewLink)",
//   });
//   // Obtiene los metadatos de los ficheros dentro de la carpeta
//   const filesMetadata = await drive.files.list({
//     q: `'${folderId}' in parents and trashed = false`,
//     fields: "files(id, name, webViewLink)",
//   });

//   // Muestra los enlaces de los ficheros
//   console.log(
//     `Enlaces de los ficheros en la carpeta "${folderMetadata.data.name}":`
//   );
//   filesMetadata.data.files.forEach((file) => {
//     console.log(`${file.name}: ${file.webViewLink}`);
//   });

//   //   const res = await drive.files.list({
//   //     q: `'${folderId}' in parents and trashed = false`,
//   //     fields: "files(name, webViewLink)",
//   //   });
//   //   const files = res.data.files;
//   //   if (files.length) {
//   //     console.log("Archivos encontrados:");
//   //     files.map((file) => {
//   //       console.log(`${file.name}: ${file.webViewLink}`);
//   //     });
//   //   } else {
//   //     console.log("No se encontraron archivos en la carpeta.");
//   //   }
// }

module.exports = {
  listFilesInFolder,
};