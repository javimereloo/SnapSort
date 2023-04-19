//THIS FILE MAY BE EXECUTED ONE TO CREATE THE INSTANCE
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
