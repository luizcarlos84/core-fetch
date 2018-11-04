const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// bodyParse
const urlencodedParser = bodyParser.urlencoded({extended : true});
const app = express();

// Custom require
const conf = require('./conf/conf');
const db = require('./repo/db');
const rootDev = require('./routers/rootDev')

// Pug config
app.set('view engine', 'pug');
app.set('views', __dirname + '/viewsDev');

passport.serializeUser((user, done) => {
   done(null, user._id);
});

passport.deserializeUser((id, done) => {
   db.findUserById(id).then( (err,user) => {
       done(err, user);
   });
});

//  ------------------------ use (Não remova de proximo do Listen)------------------------

app.use(session({
  store: new MongoStore({
    db: conf.db.hostsession(),
    ttl: 30 * 60 // = 30 minutos de sessão
  }),
  secret: '123',//configure um segredo seu aqui
  resave: false,
  saveUninitialized: false
}));


passport.use(new LocalStrategy(
  function(username, password, done){
    db.findUser( username )
    .then( async function(user, err){

      if (err)
        return done(err);

      if (!user)
        return done(null, false);

      return await user;

    }).then( function(user, err){
      bcrypt.compare(password, user.passwd, function(err, isValid){
        if (err)
          return done(err);

        if (!isValid)
          return done(null, false);

        return done(null, user);
        });
      });
    }));

app.use(passport.initialize());
app.use(passport.session());

// router
app.use('/', rootDev);

// bodyParse
app.use( bodyParse.json());
app.use( urlencodedParser);


const server = app.listen(3000, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Servidor iniciado na porta:', port);
});
