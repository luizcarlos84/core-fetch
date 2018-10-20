/* ---------------- Required ---------------- */

// // Required - exports by npm
const assert = require('assert');
const colors = require('colors');
const express = require('express');
// express
const app = express();
const router = express.Router();

//  ------------------------ set ------------------------

app.set('views', './views');
app.set('view engine', 'pug');

const fontAwesome = '/node_modules/@fortawesome/fontawesome-free';
const bootstrap = '/node_modules/bootstrap/dist';
const jQuery = '/node_modules/jquery/dist';
const popper = '/node_modules/popper.js/dist';


var accessLog = (req, res, next) => {
  // Realiza o prompt a cada acesso realizado
  console.log( Date.now(), 'acessado local', req.originalUrl);
  next();
}

var dev = (req, res, next) => {
  console.log('Request type:', req.method);
  console.log('Request URL:', req.originalUrl)
  console.log('ID:', req.params);
  next();
}

var home = (req, res) => {

  let result = '<h1>Bem vindo</h1><br>'
  result += '<small>Horario: ' + Date.now() + '</small>'

  if(req.originalUrl === '/user/' + req.params.id )
    result += '<br>' + req.params.id

  res.send(result);
}

var index = (req, res) => {
  res.render('index', { title : 'Preparando a Home'})
};

//  ------------------------ gets ------------------------

app.get('/', index );
app.get('/user/:id', home);

//  ------------------------ use (Não remova de proximo do Listen)------------------------

app.use(accessLog);
app.use('/user/:id', dev);
// app.use('/api', api); // redirect API calls
// app.use('/', express.static(__dirname + '/')); // redirect root
app.use('/jquery', express.static(__dirname + jQuery)); // redirect JS jQuery
app.use('/popper', express.static(__dirname + popper)); // redirect JS popper
app.use('/js', express.static(__dirname + bootstrap + '/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + fontAwesome + '/js')); // redirect JS fontawesome
app.use('/css', express.static(__dirname + bootstrap + '/css')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + fontAwesome + '/css')); // redirect CSS fontawesome

// Listen
app.listen(3000, () => {
  console.log('Servidor web na porta 3000');
});
