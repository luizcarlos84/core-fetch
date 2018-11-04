const express = require('express');
const router = express.Router();
const passport = require('passport');

const bodyParse = require('body-parser');
const urlencodedParser = bodyParse.urlencoded({extended : true});

//  ------------------------ DEV ------------------------


var dev = (req, res, next) => {
  console.log('Request type:', req.method);
  console.log('Request URL:', req.originalUrl)
  console.log('ID:', req.params);
  next();
}

var logInfo = (req, res, next) => {
  // Realiza o prompt a cada acesso realizado
  console.log( colors.green(Date.now()) + ' acessado local '.yellow + colors.green(req.originalUrl) );
  next();
}

//  ------------------------ Variaveis ------------------------

// Utilizado para verificar se o está logado
authenticationMiddleware = () => {
  return (req, res, next) => {
    if(req.isAuthenticated()){
      return next()
    }
    res.redirect('/login')
  }
}

// Check login
isAuthenticated = (req, res, next) => {

   if(req.user)
      return next();
   else
      return res.status(401).json({
        error: 'User not authenticated'
      });
}


var root = (req, res) => {
  // Redireciona para o Login
  res.redirect('/login');
}

// Verificação de login
var auth = passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login?fail=true'
});

var checkauth = (req, res) => {
    res.status(200).json({
        status: 'Logado com sucesso!'
    });
}

//  ------------------------ Variaveis renderização ------------------------

var login = (req, res) => {
  if(req.query.fail){

    res.render('login', {
      message: 'Usuário e/ou senha incorretos!'
    });

  }
  else{

    res.render('login', {
      message: null
    });

  }
}

var logout = (req, res) => {
  req.session.destroy( () => {
    console.log("Saindo.")

  });
redirect
  res.redirect('/login');
}

var dashboard = (req, res) => {
  res.render('dashboard', {id: req.session.user.id}, users)

}

router.get('/', root);
router.get('/login', login);
router.get('/logout', logout);
router.get('/checkauth', isAuthenticated, checkauth);
router.get('/dashboard', isAuthenticated, dashboard);

router.post('/login');

//  ------------------------ Export ------------------------

module.exports = router;
