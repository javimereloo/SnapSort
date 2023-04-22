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
          username TEXT, 
          urlFolder TEXT, 
          date DATE NOT NULL, 
          nameFolder TEXT DEFAULT 'importación', 
          PRIMARY KEY(username, urlFolder),
          FOREIGN KEY(username) REFERENCES cliente(username)
          )`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);

// Create table for imagenImpor that contains all images 
// from a Drive folder 
DB.run(
  `CREATE TABLE IF NOT EXISTS imagenImpor(
          url TEXT, 
          urlFolder TEXT, 
          PRIMARY KEY(url , urlFolder),
          FOREIGN KEY(urlFolder ) REFERENCES importacion(urlFolder)
          )`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  }
);

// Create table image 
DB.run(
  `CREATE TABLE IF NOT EXISTS table (
          url TEXT, 
          FOREIGN KEY(url ) REFERENCES imagenImpor(url)
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
