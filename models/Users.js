//create a schema with all the different fields we need for user

// From Brad Traversy https://github.com/bradtraversy/node_passport_login/blob/master/models/User.js 

//require mongoose
const mongoose = require('mongoose');

//create our UserSchema that passes in an object with all our fields, ie a name that has the type String and is required
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  adult: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    //default value of current date
    default: Date.now
  }
});

//put schema in variable, create a model from schema that passes in model name, User and our schema
const User = mongoose.model('User', UserSchema);

//exort so it can be used in other files
module.exports = User;