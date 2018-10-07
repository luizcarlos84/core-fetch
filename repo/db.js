/* ---------------- Required ---------------- */

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


/* ---------------- Uso Interno - Funções CRUD ---------------- */


// Fechar a conexão
close = async (client) => {
  return await client.then( res => {
    console.log('Conexão fechada');
    res.close();
  })
}

// Retorna um objeto de Busca - PROBLEMAS
find = async (client, db, coll, filter) => {
  return await client.db(db).collection(coll).find(filter);
}

// Retorno de array de busca
findToArray = async (client, db, coll, filter) => {
  return await client.db(db).collection(coll).find(filter).toArray();
}


// Insere um objeto por vez
// O metodo padrão é {"chave" : "Valor"}
insertOne = async (client, db, coll, object) => {
  // let client = connect();
  return await client.db(db).collection(coll).insertOne(object);
}


// Insere uma array de Objetos
// O padrão é [{"Chave" : "Valor"}, {"Chave" : "Valor"}]
insertMany = async (client, db, coll, array) => {
  return await client.db(db).collection(coll).insertMany(array);
}

/* ---------------- Uso Interno - Funções check ---------------- */


// Check objetos vazios
checkObjEmpty = obj => {
  for(key in obj){
    if(obj.hasOwnProperty(key)){
      return false;
    }
  }
  return true;
}

// Retorna um valor booleano informando se existe(true) ou não(false)
checkWallet = async (wallet) => {

  if (typeof(wallet) == 'string' && wallet.length == 34 )  {

    // Necessário converter hash160 para address

    // Abre a conexão
    let client = connect();

      return await client.then( async res => {

      let d = conf.db;
      let db = d.base[0]
      let coll = d.coll[0]

      // Busca a wallet informada
      return await findToArray(res, db, coll, {_id: wallet});


    }).then( async res => {

      // Se a wallet existe e se o objeto não é vazio
      if(res.length == 1 && !checkObjEmpty(res[0])){
        //Se o valor da wallet é igual ao do banco retorna true
        if(wallet == res[0]._id)
          return true;
        else
          return false;
      }
      else
        return false;

    }).then( res => {
      close(client);
      // O retorno precisa estar na ultima ".then"
      return res;

    }).catch( err => {
      console.warn('Erro no checkWallet\n', err);

    });

  }
  else{
    console.log('Valor inválido em db.checkWallet: ', typeof(wallet), ' ',wallet.length);
    return 0;

  }
}

// Verifica novas carteiras e geram novas fichas
checkWalletPending = async () => {

}


/* ---------------- Exportações - Funções ---------------- */

// Deve realizar uma busca no banco e devolver os valores
findWallet = async (wallet) => {

  if (typeof(wallet) === 'string') {

    // abre a conexão
    let client = connect();

    // retorna a busca
    return await client.then( async (res) => {

      let d = conf.db;
      let db = d.base[0]
      let coll = d.coll[0]

      return await findToArray(res, db, coll, {_id: wallet});

    }).then( res => {
      close(client);
      return res;

    }).catch(err => {
      console.warn('Erro na função db.findWallet:\n', err);

    });

  }
  else {
    // Valores inválidos retornam zero
    console.log('Tipo inválido em findWallet: ',typeof(wallet));
    return 0;
  }
}

// Insere wallet no banco
insertWallet = async (obj) => {

  if(typeof(obj) === 'object'){

    // Abre a conexão
    let client = connect();

    // Se a wallet existe então true
    let check = await checkObjEmpty(obj._id);

    // Retorna o a inserção
    return await client.then( async res => {

      let d = conf.db;
      let db = d.base[0];
      let coll = d.coll[0];

      // Se check for false então insere a wallet
      if(!check){
        insertOne(res, db, coll, obj);
        console.log('Wallet inserido');
      }
      else{
        console.log('Wallet já existe');
      }

    }).then( () => {
      close(client);

    }).catch( err => {
      console.warn('Erro no insertWallet\n', err);
inserido
    });

  }
  else{
    console.log('Valor inválido em insertWallet:', typeof(obj));
    return 0;
  }
}

// Insere usuários no banco
insertUser = async (user) => {

  if (user == undefined || typeof(user) != 'object')  {
    // Valores inválidos retornam zero
    return 0;
  }
  else  {

    // Abre a conexão
    let client = connect();

    return client.then( async res => {

      let d = conf.db;
      let base = d.base[1]
      let coll = d.coll[1]

      return await insertOne(client, base, coll, user);

    }).then( () => {
      close(client);

    }).catch( err => {
      console.warn('Erro no insertUser\n', err);

    });

  }
}

/* ---------------- Exportações ---------------- */

// wallets
module.exports.insertWallet = insertWallet;
module.exports.findWallet = findWallet;
module.exports.checkWallet = checkWallet;
// users
module.exports.insertUser = insertUser;
