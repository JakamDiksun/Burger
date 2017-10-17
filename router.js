
const express = require('express');
var flash = require('connect-flash');
var mysql      = require('mysql');
var nconf = require('nconf');
var connection = mysql.createConnection({
  host     : nconf.get('mysql:host'),
  user     : nconf.get('mysql:user'),
  password : nconf.get('mysql:password'),
  database : nconf.get('mysql:database'),
  multipleStatements: true
});

module.exports = function(passport){
    var router = express.Router();
  /* GET login page. */
  router.get('/', function(req, res) {
    res.sendFile(__dirname + '/frontend/toplist.html');   
  });

  router.get('/login', passport.authenticate('login', {
    successRedirect: '/index.html',
    failureRedirect: 'back',
    failureFlash : true 
  }));
  /*
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });

  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true 
  }));*/
  var isAuthenticated = function (req, res, next) {
      if (req.isAuthenticated()){
          //res.user = req.user;
          console.log("LOGGED IN");
          return next();
      }else{
          console.log("NOT LOGGED IN");
          res.redirect('/login.html');
      }
  }
    var isLogin = function (req, res, next) {
          return next();
  }


  router.get('/index.html', isAuthenticated, function(req, res){
    var userDataString = req.user.userID+"|"+req.user.permission;
    delete req.headers['user'];
    res.setHeader("user",userDataString);
    res.sendFile(__dirname + '/frontend/index.html'); 
  });
  router.get('/toplist.html', isAuthenticated, function(req, res){
    var userDataString = req.user.userID+"|"+req.user.permission;
    delete req.headers['user'];
    res.setHeader("user",userDataString);
    res.sendFile(__dirname + '/frontend/toplist.html'); 
  });
  router.get('/burgerpage.html', isAuthenticated, function(req, res){
    var userDataString = req.user.userID+"|"+req.user.permission;
    delete req.headers['user'];
    res.setHeader("user",userDataString);
    res.sendFile(__dirname + '/frontend/burgerpage.html'); 
  });
  router.get('/charts.html', isAuthenticated, function(req, res){
    res.sendFile(__dirname + '/frontend/charts.html'); 
  });
  router.get('/broadcast-message.html', isAuthenticated, function(req, res){
    res.sendFile(__dirname + '/frontend/broadcast-message.html'); 
  });
  router.get('/leaderboard.html', isAuthenticated, function(req, res){
    res.sendFile(__dirname + '/frontend/leaderboard.html'); 
  });
  router.get('/manage.html', isAuthenticated, function(req, res){
    res.sendFile(__dirname + '/frontend/manage.html'); 
  });
  router.get('/usermgmt.html', isAuthenticated, function(req, res){
    res.sendFile(__dirname + '/frontend/usermgmt.html'); 
  });
  router.get('/profile.html', isAuthenticated, function(req, res){
    var userData = req.user;
    var userDataString = userData.userID+"&"+userData.companyID+"&"+userData.userName+"&"+userData.permission;
    console.log(userDataString);
    res.setHeader("user",userDataString);
    res.sendFile(__dirname + '/frontend/profile.html'); 
  });
  /*router.get('/login.html', function(req, res){
        console.log("Navigated to /login");
    console.log(req.session);
      req.session.destroy();
    console.log(req.session);
  });*/


  router.get('/logout', function(req, res) {
    console.log("Navigated to /logout");
    console.log(req.session);
      req.session.destroy(function(err){
          req.logOut();
          req.logout();
          res.cookie('connect.sid', '', {expires: new Date(1), path: '/' });
          res.redirect('/index.html');
      });
    console.log(req.session);
      
  });
  return router;
}


