//authentication module to prevent users from accessing dashboard without being logged in
//code from Brad Traversy
//ensureAuthenticated and req.isAuthenticated are built in passport functions. If login is authenticated, dashboard page can be viewed. Otherwise, a flash message will appear and the user will be redirected to /users/login
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/users/login');
  }
}

//add this middleware to any route we want to be protected