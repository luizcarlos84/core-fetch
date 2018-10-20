/* ---------------- Required ---------------- */

// // Required ES6 Native
const util = require('util');

// // Required - exports by npm
const assert = require('assert');
const dotenv = require('dotenv');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const route = express();

// // Required - customs exports
const conf = require('./conf/conf');
const coin = require('./model/coin');
const db = require('./repo/db');
const rest = require('./model/rest');
