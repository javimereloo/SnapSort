//METHODS TO ACCESS THE DB
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const db = require("./db.config.js");

//Get user info from ID
function getUserById(id, callback) {
  db.get("SELECT * FROM users WHERE id = ?", [id], function (err, row) {
    if (err) {
      callback(err);
    } else if (!row) {
      callback(null, null);
    } else {
      callback(null, row);
    }
  });
}

//Insert a new user
function insertUser(name, email, password) {
  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Se ha insertado ${this.changes} fila`);
      }
    }
  )
}



//Export the API OPERATIONS
module.exports = {
  getUserById: getUserById,
};




//-------------------------Auxiliar cryptographic methods-----------------------
//Function thats returns the hash of a password
function crypt(password) {
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
