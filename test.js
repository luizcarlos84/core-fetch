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

// Views
async function view(){
  try{

    // Verificando retorno das function
    console.log('Informações das funções');
    console.log(wallet);
    console.log(coin.btc.latestblock());
    console.log(coin.btc.rawtx(hash));
    console.log(coin.btc.rawblock());
    console.log(coin.btc.rawaddr(wallet));
    console.log(coin.btc.balance(wallet));

  }
  catch(err){
    console.log('Erro no Codigo: ');
    console.log(err);
  }
}




// Inicializando as function
view();
