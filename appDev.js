/* ---------------- Required ---------------- */

// // Required - exports by npm
const assert = require('assert');
const bootstrap = require('bootstrap');
const colors = require('colors');
const dotenv = require('dotenv').load();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const route = express();

// // Required - customs exports
const conf = require('./conf/conf');
const coin = require('./model/coin');
const db = require('./repo/db');
const rest = require('./model/rest');

// express
const app = express();
const router = express.Router();

// Variaveis

var acesso = (req, res, next) => {
  console.log('solicitado', req.originalUrl, 'as', Date.now());
  next();
}

app.use(acesso);

app.use('/user/:id', (req, res, next) => {
  console.log('Request type:', req.method);
  next();
}, (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next();
}, (req, res, next) => {
  console.log('ID:', req.params);
  next();
})


app.get('/', (req, res) => {
  let result = 'Bem vindo<br>'
  result += '<small>Horario: ' + req.Time + '</small>'
  res.send(result);
});

app.get('/index', (req, res) => {
  res.send('Pagina principal');
});

router.get('/user/:id', (req, res, next) => {

  if(req.params.id === '0') next('route')

  else next()
}, (req, res, next) => {
  // let result = 'User'
  // result += '<br>ID:' + req.params.id;
  // res.send(result);
  res.render('regular')
});




// Listen
app.listen(3000, () => {
  console.log('Servidor web na porta 3000');
});
