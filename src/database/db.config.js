//THIS FILE MAY BE EXECUTED ONE TO CREATE THE INSTANCE
//AND THE NECESSARY TABLES 
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
db.run(`CREATE TABLE usuario (
          username TEXT PRIMARY KEY AUTOINCREMENT, 
          name TEXT, 
          lastname TEXT, 
          email TEXT , 
          password TEXT)`
       , (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Tabla creada en la base de datos.');
});

// Create a table for user information 
db.run(`CREATE TABLE importacion (
          username TEXT PRIMARY KEY AUTOINCREMENT, 
          name TEXT, 
          lastname TEXT, 
          email TEXT , 
          password TEXT)`
       , (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Tabla creada en la base de datos.');
});


//TODO COMPROBAR SI ES NECESARIO
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