const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'sqlite3', 'SNAPSORT.sqlite');

// Create a new database 
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos SQLite.');
});

// Create a table for user information 
db.run(`CREATE TABLE usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          name TEXT, 
          email TEXT UNIQUE, 
          password TEXT)`
       , (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Tabla creada en la base de datos.');
});

// Cerrar la conexión a la base de datos cuando finalice el proceso
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexión a la base de datos cerrada.');
  });
});

module.exports = db;