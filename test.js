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

// // Variaveis

const result = dotenv.config()

// Views
async function test(){
  try{

    // Verificando retorno das function
    console.log('Informações das funções');
    console.log(coin.btc.latestblock());
    console.log(coin.btc.rawtx(result.parsed.WALLET));
    console.log(coin.btc.rawblock());
    console.log(coin.btc.rawaddr(result.parsed.WALLET));
    console.log(coin.btc.balance(result.parsed.WALLET));

    if (result.error) {
      throw result.error
    }
    console.log('Variaveis .env');
    console.log(result.parsed.WALLET)

  }
  catch(err){
    console.log('Erro no test ');
    console.log(err);
  }
}




// Inicializando as function
test();
