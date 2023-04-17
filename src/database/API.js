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

function getUserdata(username ) {
  return new Promise((resolve, reject) => {
    db.get(
    "SELECT name, lastname FROM usuario WHERE username = ?",
    [username],
     (err, row) {
      if (err) {
        
      } else if (!row) {
        
      } else {
        
      }
    }
  );
  })
  
}

//Insert a new user
async function insertUser(username, name, lastname, email, password) {
  const hashedPassword = await cryptPassword(password)
  db.run(
    "INSERT INTO usuario (username, name, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
    [username, name, lastname, email, hashedPassword],
    function (err) {
      if (err) {
        console.log(err.message);
      } else {
        console.log(`Se ha insertado ${this.changes} fila`);
      }
    }
  );
}

function deleteUser(username) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM usuario WHERE username = ?', [username], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


const fs = require('fs');
function deleteDatabase() {
  return new Promise((resolve, reject) => {
    fs.unlink('src/database/SNAPSORT.sqlite', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
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
  deleteDatabase,
};
