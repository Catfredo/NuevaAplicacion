const express = require('express');
const router = express.Router();

const passport = require('passport');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');


router.get('/signup', isNotLoggedIn, (req, res)=>{
    res.render('auth/signup');
})

router.post('/signup',isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signup', {
        successRedirect: '/links',
        failureRedirect: '/signup',
        failureFlash: true
    })(req, res, next);
});


router.get('/signin', isNotLoggedIn, (req,res)=>{
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next)=>{
    passport.authenticate('local.signin', {
        successRedirect: '/links',
        failureRedirect: '/signin'
    })(req, res, next);
    
});

router.get('/completed', isLoggedIn, (req, res) =>{
    res.render('/completed');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error(err);
      }
      
      res.redirect('/signin'); 
    });
  });
  

module.exports = router;