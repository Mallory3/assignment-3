//bring in express
const express = require('express');
//bring in express layouts
const expressLayouts = require('express-ejs-layouts');
//bring in mongoose
const mongoose = require('mongoose')
//bring in flash
const flash = require('connect-flash')
//bring in session
const session = require('express-session')


//initialize app variable with express
const app = express();

//conncet to database
//need the mongoose code higher up, it is used to connect to db (works!);

//envoke dotenv
require('dotenv').config(); 

//from your boilerplate code
//const uri takes DB_CONNECTION credidentials from .env file (used because github ignores it)
const db = process.env.DB_CONNECTION;
mongoose.connect(db,{ useUnifiedTopology: true,useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


//EJS Middleware
//expressLayouts needs to be above set viewengine or it wont work
app.use(expressLayouts);
//set viewengine to EJS
app.set('view engine', 'ejs');

//BODYPARSER
//we can now get data from our form with req.body
app.use(express.urlencoded({ extended: false}));

// EXPRESS SESSION MIDDLEWARE
//aquired from express session github
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//CONNECT FLASH MIDDLEWARE
//gives us access to request.flash
app.use(flash());

//GLOBAL VARIABLES
// adding middleware so different flash messages can be different colors
//takes in three arguments, request response and next
app.use((req, res, next) => {
  // set global variables
  // custom middleware with global variables. We can call the success_msg and error_msg which will come from flash
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});


//ROUTES
//add a route to pertain to index.js and user.js files in routes folder
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//create a PORT to run our app on
//process.env.PORT incase we deploy, otherwise port 8000 on our local host
const PORT = process.env.PORT || 8000;

//run a server, pass in port and console.log to make sure its running
app.listen(PORT, console.log(`Server started on port ${PORT}`));

