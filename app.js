//bring in express
const express = require('express');
//bring in express layouts
const expressLayouts = require('express-ejs-layouts');
//bring in mongoose
const mongoose = require('mongoose')

//initialize app variable with express
const app= express();

//conncet to database
//need the mongoose code higher up, it is used to connect to db (works!)
const MongoClient = require('mongodb').MongoClient;
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

//ROUTES
//add a route to pertain to index.js and user.js files in routes folder
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//create a PORT to run our app on
//process.env.PORT incase we deploy, otherwise port 8000 on our local host
const PORT = process.env.PORT || 8000;

//run a server, pass in port and console.log to make sure its running
app.listen(PORT, console.log(`Server started on port ${PORT}`));

