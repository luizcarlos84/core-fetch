const express = require('express');
const router = express.Router();

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

//  ------------------------ Variaveis renderização ------------------------

var index = (req, res) => {
  res.render('index', {
    url      : req.originalUrl,
    title     : 'Peer2you',
    jumbotron : 'Procurando criptomoedas?',
    subtitle  : 'Conhecemos as pessoas certas! Cuidamos das informações e você do mais importante: seu dinheiro',
    more      : 'Saiba Mais'
  });
};

var register = (req, res) => {
  res.render('register', {
    url      : req.originalUrl,
    title    : 'Peer2you' + req.originalUrl,
    username : 'Usuário',
    email    : 'Email',
    password : 'Senha',
    check    : 'Lembre-me',
    submit   : 'Registrar'
  });
};

var login = (req, res) => {
  res.render('login', {
    url      : req.originalUrl,
    title    : 'Peer2you' + req.originalUrl,
    username : 'Usuário',
    email    : 'Email',
    password : 'Senha',
    check    : 'Lembre-me',
    submit   : 'Entrar'
  });
};

var dashboard = (req, res) => {
  res.render('dashboard', {
    url      : req.originalUrl,
    title    : 'Peer2you' + req.originalUrl,
    username : req.body.userName,
    token    : req.body.token,
  })
};

var config = (req, res) => {
  res.render('dashboard', {
    url      : req.originalUrl,
    title    : 'Peer2you' + req.originalUrl,
    username : req.body.userName,
    token    : req.body.token,
  })
};

var wallet = (req, res) => {
  res.render('dashboard', {
    url      : req.originalUrl,
    title    : 'Peer2you' + req.originalUrl,
    username : req.body.userName,
    token    : req.body.token,
  })
};

var donePOST = (req, res) => {

  res.render('done', {
    url      : req.originalUrl,
    title    : 'Peer2you' + req.originalUrl,
    username : req.body.InputUserName,
    email    : req.body.InputEmail,
    password : req.body.InputPassword,
    token    : req.body.token,
  });
};

//  ------------------------ Router ------------------------

router.get('/', index );
router.get('/register', register );
router.get('/login', login );
router.get('/user/dashboard', dashboard);
router.get('/user/config', config);
router.get('/user/wallet', wallet);

router.post('/done', urlencodedParser, donePOST );
router.post('/user/dashboard', dashboard);
router.post('/user/config', config);
router.post('/user/wallet', wallet);

//  ------------------------ Export ------------------------

module.exports = router;
