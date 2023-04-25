const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const db = require("./db.config.js");

//Get user info from ID
function getUserById(id, callback) {
  db.get("SELECT * FROM usuario WHERE id = ?", [id], function (err, row) {
    if (err) {
      callback(err);
    } else if (!row) {
      callback(null, null);
    } else {
      callback(null, row);
    }
  });
}

//Get username
async function getUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT username FROM usuario WHERE username = ?",
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve(row);
        }
      }
    );
  });
}

//Fuction to compare login password
async function checkPassword(username, password) {
  const storedHash = await getHash(username);
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, storedHash, (err, result) => {
      if (err) {
        reject(err);
      } else if (result) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

function getUserdata(username) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT name, lastname FROM usuario WHERE username = ?",
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        }
        if (row) {
          resolve({ name: row.name, lastname: row.lastname });
        } else {
          resolve(null);
        }
      }
    );
  });
}

//Insert a new user
async function insertUser(username, name, lastname, email, password) {
  const hashedPassword = await cryptPassword(password);
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO usuario (username, name, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, name, lastname, email, hashedPassword],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
          console.log("Nuevo usuario insertado en la base de datos ");
        }
      }
    );
  });
}

//Insert a new importation folder
async function insertImport(username, urlFolder) {
  return new Promise((resolve, reject) => {
    const now = new Date();
    console.log("la fecha now es ", now);
    const currentDate = now.toISOString().slice(0, 10);
    console.log("la fecha currentDate es ", currentDate);

    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const dateStr = `${day}/${month}`;
    const folderName = "importación del".concat(" ", dateStr);
    db.run(
      `INSERT INTO importacion (username, urlFolder, date, nameFolder) VALUES (?,?,?,?)`,
      [username, urlFolder, currentDate, folderName],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
          console.log("Nueva importación realizada por el usuario", username);
        }
      }
    );
  });
}

//Allows to change the importation name
async function changeImportName(username, urlFolder, importName) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE importacion SET nameFolder = ? WHERE urlFolder = ? AND username = ?",
      [importName, urlFolder, username],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      }
    );
  });
}

//Return the importations from a user
async function getImportaciones(username) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT nameFolder, urlFolder FROM importacion WHERE username = ?",
      [username],
      (err, rows) => {
        if (err) {
          reject(err);
        }
        if (rows) {
          const importaciones = new Map();
          rows.forEach((row) => {
            importaciones.set(row.urlFolder, row.nameFolder);
          });
          resolve(importaciones);
        } else {
          resolve([]);
        }
      }
    );
  });
}

function deleteUser(username) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM usuario WHERE username = ?", [username], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

//GOOGLE DRIVE API
//Import google API to access to folders and files
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: './credential.json',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});
const drive = google.drive({ version: 'v3', auth });
//Getting folderID
function getFolderId(url) {
  const start = url.indexOf("/folders/") + "/folders/".length;
  const end = url.indexOf("?");
  return url.substring(start, end);
}
//Getting folder files
async function listFilesInFolder(urlFolder) {
  const folderId = getFolderId(urlFolder);

  const folderMetadata = await drive.files.get({
    fileId: folderId,
    fields: "name, files(id, name, webViewLink)",
  });
  // Obtiene los metadatos de los ficheros dentro de la carpeta
  const filesMetadata = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, webViewLink)",
  });

  // Muestra los enlaces de los ficheros
  console.log(
    `Enlaces de los ficheros en la carpeta "${folderMetadata.data.name}":`
  );
  filesMetadata.data.files.forEach((file) => {
    console.log(`${file.name}: ${file.webViewLink}`);
  });

  //   const res = await drive.files.list({
  //     q: `'${folderId}' in parents and trashed = false`,
  //     fields: "files(name, webViewLink)",
  //   });
  //   const files = res.data.files;
  //   if (files.length) {
  //     console.log("Archivos encontrados:");
  //     files.map((file) => {
  //       console.log(`${file.name}: ${file.webViewLink}`);
  //     });
  //   } else {
  //     console.log("No se encontraron archivos en la carpeta.");
  //   }
}

//-------------------------Auxiliar cryptographic methods-----------------------
//Function that returns the hash of a password
function cryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

//Function that compares the password and his string
function comparePassword(username, password) {
  const storedHash = getHash(username);
  bcrypt.compare(password, storedHash, (err, result) => {
    if (err) {
      console.error(err.message);
    } else if (result) {
      console.log("La contraseña es correcta");
    } else {
      console.log("La contraseña es incorrecta");
    }
  });
}

async function getHash(username) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT password FROM usuario WHERE username = ?",
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.password : null);
        }
      }
    );
  });
}

//Export the API OPERATIONS
module.exports = {
  getUserById,
  insertUser,
  getUsername,
  getUserdata,
  checkPassword,
  insertImport,
  getImportaciones,
  changeImportName,
  listFilesInFolder,
};
