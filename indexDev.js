/* ---------------- Required ---------------- */

// // Required - exports by npm
const assert = require('assert');
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
var e = '3MSCFLrkEhiEzigXcoaCVeJwouJtz9Ye6A' //novo
var f = '13ceZUnVNPMNfY9X7fiiceyXUKk4YfrTvH' //novo
var x = ['a', 'b', 'c', 'd'];
var y = []
var id = '123456'

var wallet = f;


var usuario = conf.user('Luiz', 'admin123');
usuario.wallets.push(a);
usuario.wallets.push(b);
usuario.wallets.push(c);
usuario.wallets.push(d);
usuario.wallets.push(e);
usuario.wallets.push(f);

// let d = conf.db;
// let db1 = d.base[0]
// let coll = d.coll[0]


// console.log(typeof(usuario));
// console.log(typeof(usuario.username));
console.log(usuario);
console.log(__dirname);

// console.log('Carteira: %s3'.green, colors.blue('teste'), e );

// db.insertUser(usuario);
// console.log(wallet);
// console.log(db1);
// console.log(coll);
// db.findOne(db1, coll, {}, { projection:{ '_id': 1 } }).then(res => {
//   console.log(res);
// });


// new Promise(async function(resolve, reject) {
//   tx = await db.unknownWallet(wallet);
//   resolve(tx);
// }).then( async res => {
//   console.log('1',res);
// });


// db.insertWalletPending(usuario._id, usuario.wallets);

// client = db.connect();
//
// client.then( async res => {
//   let result = await db.unknownWallet(res, a);
//   console.log(result);
//   return res;
// }).catch(err => {
//   console.log(err);
// })





/* ---------------- Area de Testes ----------------
Fique a vontade para testar qualquer parametros após
esse comentário.
Evite usar o index.js deixando vestígios de código.
*/

// rest.req(test).then(res =>{
//   console.log(res);
// })

// Controle de array
// console.log(x);
// x.splice(0);
// console.log(x);


// busca(c).then( res => {
//   console.log(res);
//   console.log(d.length);
//   console.log(e.length);
//
// }).catch( err => {
//   console.log('Erro em indexDev.js.busca\n', err);
//
// })
//
// x.forEach((element, index, array) => {
//   console.log(element, ' ', index, ' ', array);
// })
