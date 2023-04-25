//AND THE NECESSARY TABLES
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "SNAPSORT.sqlite");

// Create a new database
let DB = new sqlite3.Database(dbPath, (err) => {
  if (err && err.code == "SQLITE_CANTOPEN") {
    console.error(err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
  }
});

// Create a table for user information
DB.run(
  `CREATE TABLE IF NOT EXISTS usuario (
          username TEXT PRIMARY KEY, 
          name TEXT, 
          lastname TEXT, 
          email TEXT , 
          password TEXT)`,
  (err) => {
    if (err) {
      console.error(err.message);
    } 
  }
);

// Create table for importation info
DB.run(
  `CREATE TABLE IF NOT EXISTS importacion (
          importID INT(8) ZEROFILL NOT NULL AUTO_INCREMENT,
          username TEXT NOT NULL, 
          urlFolder TEXT NOT NULL, 
          date DATE NOT NULL, 
          nameFolder TEXT DEFAULT 'importación', 
          PRIMARY KEY(importID),
          FOREIGN KEY(username) REFERENCES cliente(username)
          )`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);

// Create table for imagen that contains all images 
DB.run(
  `CREATE TABLE IF NOT EXISTS imagen(
          imagenID INT(8) ZEROFILL NOT NULL AUTO_INCREMENT,
          urlFolder TEXT NOT NULL, 
          url TEXT NOT NULL, 
          PRIMARY KEY(imagenID),
          FOREIGN KEY(urlFolder ) REFERENCES importacion(urlFolder)
          )`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);



//TODO COMPROBAR SI ES NECESARIO
// Cerrar la conexión a la base de datos cuando finalice el proceso
process.on("exit", () => {
  DB.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Conexión a la base de datos cerrada.");
  });
});

module.exports = DB;
