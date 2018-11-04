/* ---------------- Required ---------------- */

// // Required - exports by npm
const assert = require('assert');
const bcrypt = require('bcrypt');
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
var senha = '123456'

var wallet;


var usuario = conf.user('Admin', 'admin@rmail.com', '123456');
usuario.wallets.push(a);
usuario.wallets.push(b);
usuario.wallets.push(c);
usuario.wallets.push(d);
usuario.wallets.push(e);
usuario.wallets.push(f);
