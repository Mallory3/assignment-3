//code from Brad Traversy
//bring in passport-local for LocalStrategy
const LocalStrategy = require('passport-local').Strategy;
//bring in mongoose to login and check if name and password match
const mongoose = require('mongoose');
//bring in bcrypt to compare hash password to plain text
const bcrypt = require('bcryptjs');
//bring in User model
const User = require('../models/Users');
const passport = require('passport')

// export strategy with a function that takes in passport from app.js file and add a new LocalStrategy with some options. Since we are not using a username, assign this field to 'email'. Arrow function takes in email, password and done.
module.exports = function() {
  passport.use(
    new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
      // first we need to see if there is a user with the email using mongoose. If there is .then
      User.findOne({ email: email })
      .then(user => {
        //if no user exists, send message "That email is not registered"
        if(!user) {
          return done(null, false, { message: 'That email is not registered'});
        }
        //Match password using bcrypt because password in database in hashed but password they submit is not
        //.compare takes in password and user.password(hashed) from database. Then callback with possible error of if isMatch = true return done and pass in null for error and user for the user. Else if doesnt match ruturn done and pass in null and false and a message "password incorrect"
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });

      })
      .catch(err => console.log(err));
    })
  );
  //calling method for serilizing and deserilizing the user
  //from passport documentation on website (http://www.passportjs.org/docs/): In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser. Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}


