//METHODS TO ACCESS THE DB 
const sqlite3 = require('sqlite3').verbose()

const db = require('./db.config.js')

//Get user info from ID
function getUserById(id, callback) {
  db.get('SELECT * FROM users WHERE id = ?', [id], function(err, row) {
    if (err) {
      callback(err);
    } else if (!row) {
      callback(null, null);
    } else {
      callback(null, row);
    }
  });
}


//Export the API OPERATIONS
module.exports = {
  getUserById: getUserById,
  
};