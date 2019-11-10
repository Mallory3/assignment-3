//bring in express
const express = require('express');
//to use express need a router
const router = express.Router();

//whenever we want to create a route, use router.get
//creating homepage route that renders the welcome view
router.get('/', (req, res) => res.render('welcome') )


module.exports = router;