const sqlite3 = require('sqlite3').verbose();

// Crear una nueva base de datos en memoria
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos SQLite.');
});

// Crear una tabla en la base de datos
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