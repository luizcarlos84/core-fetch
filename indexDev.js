// ---------------- Required ----------------

// Required - exports by npm
const dotenv = require('dotenv').load();
var MongoClient = require('mongodb').MongoClient;
// Required - customs exports
const c = require('./conf/conf');
const r = require('./model/rest');
const t = require('./model/timeStamp');
const db = require('./repo/db2');

// ---------------- Variables ----------------

// Objetos na busca
obj = { "_ID" : "5b777111ebcd8f1a5929b451" };
// Variavel de busca
busca = 'Nexus One'
// Parametros de indexaçãoptimize
// Quais campos variaveis deverão ser indexadas
index = { name: 1 , product: 1 };

// ---------------- Funções ----------------

// db.search(function(items) {
//   console.info('The promise was fulfilled with items!', items);
// }, function(err) {
//   console.error('The promise was rejected', err, err.stack);
// });

db.search2().then(function(items) {
  console.info('The promise was fulfilled with items!\n', items);
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});

x = db.search2(busca);
// db.searchFull();
// db.searchOne();
