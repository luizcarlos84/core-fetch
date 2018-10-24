/* ---------------- Required ---------------- */

// // Required - exports by npm
const colors = require('colors');
const express = require('express');
const bodyParse = require('body-parser');
const root = require('./routers/root');

// bodyParse
const urlencodedParser = bodyParse.urlencoded({extended : true});

// express
const app = express();
// const router = express.Router();

//  ------------------------ set ------------------------

app.set('views', './views');
app.set('view engine', 'pug');

const fontAwesome = '/node_modules/@fortawesome/fontawesome-free';
const bootstrap = '/node_modules/bootstrap/dist';
const jQuery = '/node_modules/jquery/dist';
const popper = '/node_modules/popper.js/dist';


//  ------------------------ use (Não remova de proximo do Listen)------------------------

// router
app.use('/', root);

// bodyParse
app.use( bodyParse.json());
app.use( urlencodedParser);

// Statics
app.use( '/images', express.static(__dirname + '/views/images'));
app.use( '/jquery', express.static(__dirname + jQuery)); // redirect JS jQuery
app.use( '/popper', express.static(__dirname + popper)); // redirect JS popper
app.use( '/js', express.static(__dirname + bootstrap + '/js')); // redirect bootstrap JS
app.use( '/js', express.static(__dirname + fontAwesome + '/js')); // redirect JS fontawesome
app.use( '/css', express.static(__dirname + bootstrap + '/css')); // redirect CSS bootstrap
app.use( '/css', express.static(__dirname + fontAwesome + '/css')); // redirect CSS fontawesome

// Manter no fim dos appuse -   Error Handle
app.use((req, res, next) => {
  res.status(404);

  res.render('error/404');
});

app.use((err, req, res, next) => {
  res.status(500);

  res.render('error/500', {error : err,});
});

// Listen
var server = app.listen(3000, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Servidor iniciado na porta:', port);
});
