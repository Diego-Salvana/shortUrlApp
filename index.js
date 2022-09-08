const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const csrf = require('csurf');
const { create } = require('express-handlebars');
require('dotenv').config();
const clientDB = require('./database/db');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
var cors = require('cors');

const app = express();

app.use(
   cors({ credentials: true, origin: process.env.PATHHEROKU || '*', methods: ['GET', 'POST'] })
);

app.set('trust proxy', 1);
app.use(
   session({
      secret: process.env.SECRETSESSION,
      resave: false,
      saveUninitialized: false,
      name: 'secret-name',
      store: MongoStore.create({ clientPromise: clientDB, dbName: 'shortUrlDatabase' }),
      cookie: {
         secure: true /* sólo permite peticiones https */,
         maxAge: 30 * 24 * 60 * 60 * 1000,
      },
   })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Este va si o si
passport.serializeUser(
   (user, done) => done(null, { id: user._id, userName: user.userName }) //se guardará en req.user
);

// no preguntar en DB???
passport.deserializeUser(async (user, done) => {
   return done(null, user); //se guardará en req.user
});

const hbs = create({
   extname: '.hbs',
   partialsDir: ['views/components'],
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

// Middlewares
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));

app.use(csrf());
app.use((req, res, next) => {
   res.locals.csrfToken = req.csrfToken();
   next();
});
app.use(mongoSanitize());

app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('App corriendo 🚀 en puerto: ' + PORT));
