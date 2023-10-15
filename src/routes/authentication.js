const express = require('express');
const router = express.Router();

const passport = require('passport');


router.get('/signup', (req, res)=>{
    res.render('auth/signup');
})

router.post('/signup', (req, res, next) => {
    passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', (req, res) =>{
    res.send('this is your profile')
});
module.exports = router;