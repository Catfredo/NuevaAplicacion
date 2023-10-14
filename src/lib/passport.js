const passport = require('passport');
const Localstrategy = require('passport-local').Strategy

const pool = require('../database');
const helpers = require('../lib/helpers')

passport.use('local.signup', new Localstrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback:  true
}, async (req, username, password, done) =>{
    const {fullname} = req.body;
    const newUser ={
        username,
        fullname,
        password
        
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);

}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async (id,done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE ID_User =?',[id]);
    done(null, rows[0]);
});