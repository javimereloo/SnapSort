const {Schema, model} = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    last_name: String,
    user_name: String,
    mail: String,
    password: String
  },
  {
    timestamps:true,
    versionkey:false,
  }
);

module.exports = model('User', userSchema);