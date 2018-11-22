/* ---------------- Required ---------------- */

// // Required - exports by npm
const assert = require('assert');
const bcrypt = require('bcrypt');
const colors = require('colors');
const dotenv = require('dotenv').load();
const MongoClient = require('mongodb').MongoClient;

// // Required - customs exports
const conf = require('./conf/conf');
const coin = require('./model/coin');
const db = require('./repo/db');
const rest = require('./model/rest');

const saltRounds = 10;

/* ---------------- Funções ----------------*/

sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ---------------- Variables ----------------
Fique a vontade para testar qualquer parametros após
esse comentário.
Evite usar o index.js deixando vestígios de código.
*/

var test = 'https://blockchain.info/multiaddr?active=1KDEVePj4eL91ETBKs2HS74AoxABsPWHqe|1Dzhw2EwFPBpWVuKZqkya5deUqyUUrpsTj';
var a = '1Dzhw2EwFPBpWVuKZqkya5deUqyUUrpsTj' //inserido
var b = '34oTrVRPpMtYQhyuUQNcJQCS9fo7CNfzKd' //inserido
var c = '3K9jB6tewg88TXpxKpiuGh8sorX3bHm1ar' //inserido
var d = '3PFBqQw6D61CXgbixxqTXuavaAvYz2iu3S' //novo
var e = '3MSCFLrkEhiEzigXcoaCVeJwouJtz9Ye6A' //novo
var f = '13ceZUnVNPMNfY9X7fiiceyXUKk4YfrTvH' //novo
var x = ['a', 'b', 'c', 'd'];
var y = [];
var senha = 'teste1'

bcrypt.hash(senha, saltRounds, (err, hash) => {

  var usuario = conf.user('teste1', 'teste1@rmail.com', hash );
  // usuario.wallets.push(a);
  // usuario.wallets.push(b);
  // usuario.wallets.push(c);
  usuario.wallets.push(d);
  usuario.wallets.push(e);
  usuario.wallets.push(f);

  // console.log(usuario);


})

var base = 'users';
var coll = 'users';
var query = [{teste : 01 }, {teste: 02}];
var filter = { teste : { $eq:01}}
var update = { $set: {teste: 02} }
var options = {ordered: false};


// db.insertMany(base, coll, query, options);
// db.updateOne(base, coll, filter, update, options)
db.unknownWallet('3K9jB6tewg88TXpxKpiuGh8sorX3bHm1ar', res => {
  console.log(res);
})
db.unknownWallet('3MSCFLrkEhiEzigXcoaCVeJwouJtz9Ye6A', res => {
  console.log(res);
})
// Epoch é diferente de timestamp. é preciso multiplicar por 1000
x = new Date(1538650887 * 1000)
console.log(x.getDay(),x.getMonth(),x.getFullYear());
