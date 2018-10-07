/* ---------------- Required ---------------- */

// // Required - exports by npm
const assert = require('assert');
const dotenv = require('dotenv').load();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const route = express();

// // Required - customs exports
const conf = require('./conf/conf');
const coin = require('./model/coin');
const db = require('./repo/db');
const rest = require('./model/rest');

/* ---------------- Variables ----------------
Fique a vontade para testar qualquer parametros após
esse comentário.
Evite usar o index.js deixando vestígios de código.
*/

var model = conf.model();
var test = 'https://blockchain.info/multiaddr?active=1KDEVePj4eL91ETBKs2HS74AoxABsPWHqe|1Dzhw2EwFPBpWVuKZqkya5deUqyUUrpsTj';
var a = '1Dzhw2EwFPBpWVuKZqkya5deUqyUUrpsTj' //inserido
var b = '34oTrVRPpMtYQhyuUQNcJQCS9fo7CNfzKd' //inserido
var c = '3K9jB6tewg88TXpxKpiuGh8sorX3bHm1ar' //inserido
var d = '3PFBqQw6D61CXgbixxqTXuavaAvYz2iu3S' //novo
var x = ['a', 'b', 'c', 'd'];
// var f = ''

/* ---------------- Area de Testes ----------------
Fique a vontade para testar qualquer parametros após
esse comentário.
Evite usar o index.js deixando vestígios de código.
*/

// rest.req(test).then(res =>{
//   console.log(res);
// })

busca = async (filt) => {

  // Executa a busca no banco
  return await db.checkWallet(filt);
}

// console.log(x);
// x.splice(0);
// console.log(x);

busca(d).then( res => {
  console.log(res);

}).catch( err => {
  console.log('Erro em indexDev.js.busca\n', err);

})
