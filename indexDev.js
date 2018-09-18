// ---------------- Required ----------------

// Required - exports by npm
const dotenv = require('dotenv').load();
var MongoClient = require('mongodb').MongoClient;
// Required - customs exports
const c = require('./conf/conf');
const r = require('./model/rest');
const t = require('./model/timeStamp');
const db = require('./repo/db');

const conf = c.db.host();

console.warn(conf);
