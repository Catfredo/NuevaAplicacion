const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mySQLstore = require('express-mysql-session')(session);
const passport = require('passport');

const { database } = require('./keys');


//initializations
const app = express();
require('./lib/passport');

//settings 
app.set('port', process.env.PORT | 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir : path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//middlewares
app.use(session({
    secret: 'Luismysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new mySQLstore({
        host: database.host,
        user: database.user,
        password: database.password,
        database: database.database,
        createDatabaseTable: true
    },)
}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//Global variables
app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//Starting Server
app.listen(app.get('port'), () => {
    console.log('Servidor exitoso', app.get('port'));
});