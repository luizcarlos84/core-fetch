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
const db = require('./db/db');
const rest = require('./model/rest');

const saltRounds = 10;

const score = require('./module/score');
const pending = require('./module/pending');
const update = require('./module/update');

/* ---------------- Funções ----------------*/

sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ---------------- Variables ----------------
Fique a vontade para testar qualquer parametros após
esse comentário.
Evite usar o index.js deixando vestígios de código.
*/

// var test = 'https://blockchain.info/multiaddr?active=1KDEVePj4eL91ETBKs2HS74AoxABsPWHqe|1Dzhw2EwFPBpWVuKZqkya5deUqyUUrpsTj';
// var a = '1Dzhw2EwFPBpWVuKZqkya5deUqyUUrpsTj' //inserido
// var b = '34oTrVRPpMtYQhyuUQNcJQCS9fo7CNfzKd' //inserido
// var c = '3K9jB6tewg88TXpxKpiuGh8sorX3bHm1ar' //inserido
// var d = '3PFBqQw6D61CXgbixxqTXuavaAvYz2iu3S' //novo
// var e = '3MSCFLrkEhiEzigXcoaCVeJwouJtz9Ye6A' //novo
// var f = '13ceZUnVNPMNfY9X7fiiceyXUKk4YfrTvH' //novo
// var x = ['a', 'b', 'c', 'd'];
//
// var y = [{'a' : 1}, {'b' : 2}];
// var z = [{'c' : 3}, {'d' : 4}];
//
// console.log(x);
// x.splice(0);
// console.log(x);
//
// coin.btc.address('34oTrVRPpMtYQhyuUQNcJQCS9fo7CNfzKd').then( res => {
//   console.log(res);
// })

// coin.btc.hashtoaddress('ec7039d9c0b3d44817b0b4fc5e478fac055f27cb', res => {
//   console.log('Resposta: ', res);
// })
//
// x = 15552000000 //seis meses
//
// console.log(new Date().getTime() - x);

// update.wallet();
score.wallet()

// console.log(conf.db.hostsession());
