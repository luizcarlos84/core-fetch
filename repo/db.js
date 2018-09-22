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
const conf = require('../conf/conf');
const coin = require('../model/coin');
const rest = require('../model/rest');


/* ---------------- Uso Interno - Promise ---------------- */


// Promise inicia a conexão
const connect = () => {
  return new Promise( (resolve, reject) => {
    MongoClient.connect( conf.db.hostwallet() , { useNewUrlParser: true }, (err, client) => {
      assert.equal(null, err);
      console.log('Conexão aberta');
      resolve(client);
    });
  })
}


/* ---------------- Uso Interno - Funções ---------------- */


// Fechar a conexão
close = (client) => {
  return client.then( res => {
    console.log('Conexão fechada');
    res.close();
  })
}


// Retorno de array de busca
findToArray = (client, db, coll) => {
  return client.db(db).collection(coll).find().toArray();
}


// Insere um objeto por vez
// O metodo padrão é {"chave" : "Valor"}
insertOne = (client, db, coll, object) => {
  return client.db(db).collection(coll).insertOne(object);
}


// Insere uma array de Objetos
// O padrão é [{"Chave" : "Valor"}, {"Chave" : "Valor"}]
insertMany = (client, db, coll, array) => {
  return client.db(db).collection(coll).insertMany(array);
}


/* ---------------- Exportações - Funções ---------------- */

// Deve realizar uma busca no banco e devolver os valores

searchWallet = (client) => {
  return client.then( res => {

    let d = conf.db;
    let base = d.base[0]
    let coll = d.coll[0]

    return findToArray(res, base, coll);

  }).then(() => {
    close(client);

  }).catch(err => {
    console.warn('Erro no searchWallet:\n', err);

  });
}


insertWallet = (client, model) => {
  return client.then( res => {

    let d = conf.db;
    let base = d.base[0]
    let coll = d.coll[0]

    if( util.isArray(model.data.result) ){
      let array = model.data.result;

      insertMany(res, base, coll, array);

    }
    else{
      console.warn('model.data.result não é uma array');
    }

  }).then(() => {
    close(client);

  }).catch( err => {
    console.warn('Erro no insertWallet\n', err);

  });

}


// Retona os valores inexistentes no banco

excludente = () => {}

/* ---------------- Exportações ---------------- */

// Função
module.exports.connect = connect;
module.exports.insertWallet = insertWallet;
module.exports.searchWallet = searchWallet;
