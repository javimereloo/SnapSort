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
  return new Promise((resolve, reject) => {

    const storedHash = getHash(username);
    console.log("password que llega> ", password)
    console.log("hash que llega> ", storedHash)
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

function getUserdata(username, callback) {
  db.get(
    "SELECT name, lastname FROM usuario WHERE username = ?",
    [username],
    function (err, row) {
      if (err) {
        callback(err);
      } else if (!row) {
        callback(null, null);
      } else {
        callback(null, row);
      }
    }
  );
}

//Insert a new user
function insertUser(username, name, lastname, email, password) {
  db.run(
    "INSERT INTO usuario (username, name, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
    [username, name, lastname, email, password],
    function (err) {
      if (err) {
        console.log(err.message);
      } else {
        console.log(`Se ha insertado ${this.changes} fila`);
      }
    }
  );
}

//-------------------------Auxiliar cryptographic methods-----------------------
//Function that returns the hash of a password
function cryptPassword(password) {
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      console.error(err.message);
      return null;
    } else {
      console.log(`La contraseña cifrada es: ${hash}`);
      return hash;
    }
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

function getHash(username) {
  //get the stored hash
  const storedHash = db.get(
    "SELECT password FROM usuario WHERE username = ?",
    [username],
    function (err, row) {
      if (err) {
        console.log("Error getting password");
      } else if (!row) {
        console.log("Can´t find this username account");
        return null;
      } else {
        return row;
      }
    }
  );
}

//Export the API OPERATIONS
module.exports = {
  getUserById,
  insertUser,
  getUsername,
  getUserdata,
  checkPassword,
};
