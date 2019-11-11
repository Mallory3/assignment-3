//bring in express
const express = require('express');
//to use express need a router
const router = express.Router();
//bring in bcryptjs
const bcrypt = require('bcryptjs')

//bring in our model so we can call methods on User
const User = require('../models/Users')

//whenever we want to create a route, use router.get

//LOGIN PAGE
//renders login.ejs file in views folder
router.get('/login', (req, res) => res.render('login') )

//REGISTER PAGE
//enders register.ejs file in views folder
router.get('/register', (req, res) => res.render('register') )

//REGISTER HANDLE
router.post('/register', (req, res) => {
  //test
  console.log(req.body)
  //pull things out of request.body
  const {name, email, password, password2 } = req.body
  //validation
  //initialize an array called errors
  let errors = []
  
  //check required fields (VALIDATION)
  //if no name, email, passowrd or password2 filled in take errors and push onto it a message that says please fill in all fields
  if(!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields'});
  }

  //check passwords match
  //if password does not equal password2 take errors and push on to it a message that says password do not match
  if(password !== password2) {
    errors.push({ msg: 'Passwords do not match'});
  }

  //check password is at least 6 characters long
  //if password length is not at least 6 characters long take errors and push on to it a message that says Password must be at least 6 characters long
  if(password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters long'});
  }
  //if errors.length is greater than 0, that means we have an issue and we want to rerender the registration form and pass in variables. It will loop through and pass errors as well as look at the variables values to ensure entire form is not cleared when there is an error
  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed then..
    //Make sure the user is not already registerd
    //findOne is a mongoose model that finds one record with the query email = email. Returns a promise .then that gives us the user and we want to check for that user. If there is a user we want to rerender the register form and send an error
    User.findOne({ email: email })
      .then(user => {
        if(user) {
          //user exisits
          errors.push({msg: "Email is already registered"})
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
      } else {
        //if there isn't a user, then we need to create a new one and use bcrypt to encrypt the password
        //when you have a model and you want to create a new user, you want to use the new keyword. Then you want to pass in the values
        const newUser = new User({
          name,
          email,
          password
        })
        //test
        console.log(newUser)
        //Hash password so password is encrypted, not in plain text
        //genSalt is a bcrypt function that passes in a salt argument
        bcrypt.genSalt(10, (error, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          //set password to hashed
          newUser.password = hash;
          //save user (gives us a promise)
          newUser.save()
            // if user gets saved, redirect to login page
            .then(user => {
              // creates success message
              req.flash('success_msg', 'You are now registered and can login');
              //redirects to login page
              res.redirect('/users/login');
            })
            // if it gives us an error, console.log it
            .catch(err => console.log(err));
        }))
      }
  });
}
})

module.exports = router;