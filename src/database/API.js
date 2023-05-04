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

//Insert a new importation folder and returns importID
async function insertImport(username, urlFolder) {
  return new Promise((resolve, reject) => {
    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10);
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const dateStr = `${day}/${month}`;
    const folderName = "importación del".concat(" ", dateStr);
    db.run(
      `INSERT INTO importacion (username, urlFolder, date, nameFolder) VALUES (?,?,?,?)`,
      [username, urlFolder, currentDate, folderName],
      async function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

//Function that returns the owner of the image
async function getImageOwner(imagenID) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT username FROM importacion WHERE importID IN (SELECT importID FROM imagen WHERE imagenID = ?)`,
      [imagenID],
      (err, row) => {
        if (err) {
          reject(err);
        }
        if (row) {
          resolve(row);
        } else {
          resolve([]);
        }
      }
    );
  });
}

//Returns image information
async function getImageInfo(imagenID){
  return new Promise((resolve,reject) => {
    db.get(
      `SELECT importID, url, title, score, topic FROM imagen  WHERE imagenID = ?`,
      [imagenID],
      (err,row)=>{
        if(err){
          reject(err);
        }
        if(row){
          const imageInfo ={
            imagenID: imagenID,
            importID: row.imporID,
            url: row.url,
            title: row.title,
            score: row.score,
            topic: row.topic
          } 
          resolve(imageInfo);
        }else{
          resolve([]);
        }
      }
    );
  });
  
}

//Modify image info 
async function changeImagenInfo(imagenID, title, score, topic){
  return new Promise((resolve, reject)=>{
    db.run(
      `UPDATE imagen SET score = ?, title = ?, topic = ? WHERE imagenID =?`,
      [score, title, topic, imagenID],
      (err) => {
        if(err){
          reject(err);
        }else{
          resolve();
        }
      }
    );
  });
}

//Deletes a folder
async function deleteFolder(username, importID) {
  return new Promise((resolve, reject) => {
    // const importID
    db.run(
      `DELETE FROM importacion WHERE username = ? AND importID = ?`,
      [username, importID],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

//Allows to change the importation name
async function changeImportName(username, importID, importName) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE importacion SET nameFolder = ? WHERE importID = ? AND username = ?",
      [importName, importID, username],
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
      "SELECT nameFolder, urlFolder, importID FROM importacion WHERE username = ?",
      [username],
      (err, rows) => {
        if (err) {
          reject(err);
        }
        if (rows) {
          const importaciones = rows.map((row) => ({
            urlFolder: row.urlFolder,
            nameFolder: row.nameFolder,
            importID: row.importID,
          }));
          resolve(JSON.stringify(importaciones));
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

async function insertNewImage(importID, url, title) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO imagen (importID , url, title) VALUES (?,?,?)",
      [importID, url, title],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function getAllImages(username) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT i.imagenID, i.title, i.url
       FROM imagen i 
       INNER JOIN importacion imp ON i.importID = imp.importID
       WHERE imp.username = ?`,
      [username],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const images = rows.map((row) => ({
            imagenID: row.imagenID,
            title: row.title,
            url: row.url,
          }));
          resolve(JSON.stringify(images));
        }
      }
    );
  });
}

async function getImagesFromImport(username, importID) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT imagenID, title, url FROM imagen 
       WHERE importID = ?`,
      [importID],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const images = rows.map((row) => ({
            imagenID: row.imagenID,
            title: row.title,
            url: row.url,
          }));
          resolve(JSON.stringify(images));
        }
      }
    );
  });
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
  insertNewImage,
  getImagesFromImport,
  getAllImages,
  deleteFolder,
  getImageOwner,
  getImageInfo,
  changeImagenInfo,
};
