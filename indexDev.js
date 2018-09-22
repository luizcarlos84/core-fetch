/* ---------------- Required ---------------- */

// // Required ES6 Native
const util = require('util');

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

/* ---------------- Variables ---------------- */

var model = conf.model();
var test = {a:1};

model.data.result.push(test);

/* ---------------- Area de Testes ----------------
Fique a vontade para testar qualquer parametros após
esse comentário.
Evite usar o index.js deixando vestígios de código.
*/
console.warn(model);
console.warn(util.isArray(model.data.result));
console.warn(util.isArray(test));
