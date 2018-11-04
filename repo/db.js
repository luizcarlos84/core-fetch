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
const conf = require('../conf/conf');
const coin = require('../model/coin');
const rest = require('../model/rest');


/* ---------------- Uso Interno - Promise ---------------- */


// Promise inicia a conexão
const connect = () => {
  return new Promise( (res, rej) => {
    MongoClient.connect( conf.db.hostwallet() , {
      useNewUrlParser: true
    }, (err, client) => {
      assert.equal(null, err);
      console.log('MongoDB:'.blue,'Conexão aberta'.green);
      res(client);
    });
  });
}

const global = () => {
  MongoClient.connect( conf.db.hostwallet() , {
    useNewUrlParser: true
  }, (err, client) => {
    assert.equal(null, err);
    console.log('MongoDB:'.blue,'Conexão aberta'.green);
    res(client);
  });
}

// Delay
const delay = (ms) => new Promise(
  (resolve) => setTimeout(resolve, ms)
);


/* ---------------- Uso Interno - Funções CRUD ---------------- */


// Retorna um objeto de Busca
findOne = async (db, coll, query, options) => {

  // Variavel de saída
  let result

  // Abre a conexão como promise e armazena resultado na variavel de saída
  return await connect().then( client => {

    console.log('MongoDB:'.blue,'findOne: DB:'.green, db, 'Collection:'.green, coll);

    if(typeof(options) == 'object')
      result = client.db(db).collection(coll).findOne(query, options);
    else
      result = client.db(db).collection(coll).findOne(query);

    return client;

  }).then( client => {
    // Fecha a conexão
    client.close();
    console.log('MongoDB:'.blue,'findOne: Conexão fechada'.green);

    // Saída
    return result;

  }).catch( err => {
    console.log('MongoDB:'.blue,'Erro em findOne\n'.red ,err);
  });

}



// Retorno de array de busca
findToArray = async (db, coll, query, options) => {

    // Variavel de saída
    let result

    // Abre a conexão como promise e armazena resultado na variavel de saída
    return await connect().then( async client => {

      console.log('MongoDB:'.blue,'findToArray: DB:'.green, db, 'Collection:'.green, coll);

      if(typeof(options) == 'object')
        result = client.db(db).collection(coll).find(query, options).toArray();
      else
        result = client.db(db).collection(coll).findOne(query).toArray();

      return client;

    }).then( res => {
      // Fecha a conexão
      res.close();
      console.log('MongoDB:'.blue,'findToArray: Conexão fechada'.green);

      // Saída
      return result;

    }).catch( err => {
      console.log('MongoDB:'.blue,'Erro em findToArray\n'.red ,err);
    });

}


// Insere um objeto por vez
// O metodo padrão é {"chave" : "Valor"}
insertOne = (db, coll, object) => {

  connect().then( client => {
    console.log('MongoDB:'.blue,'insertOne: Salvando em:'.green, coll);
    client.db(db).collection(coll).insertOne(object);

    return client ;

  }).then( res => {
    console.log('MongoDB:'.blue,'insertOne: Conexão fechada'.green);
    res.close();

  }).catch( err => {
    console.log('MongoDB:'.blue,'insertOne: Erro em insertOne\n'.red ,err);
  });

}


// Insere uma array de Objetos
// O padrão é [{"Chave" : "Valor"}, {"Chave" : "Valor"}]
insertMany = (db, coll, array) => {

  connect().then( client => {
    console.log('MongoDB:'.blue,'insertMany: Salvando em:'.green, coll);
    client.db(db).collection(coll).insertMany(array);

    return client ;

  }).then( res => {
    console.log('MongoDB:'.blue,'insertMany: Conexão fechada'.green);
    res.close();

  }).catch( err => {
    console.log('MongoDB:'.blue,'insertMany: Erro em insertMany\n'.red ,err);
  });

}


// Update de informações. É necessário Parametros senão todo o banco é atualizado
updateOne = (client, db, coll, query, options) => {
  if(options == 'undefined'){
    console.log('Atualizado em %s comentado(não realizado):'.red, coll);
    // return client.db(db).collection(coll).updateOne(query)
  }
  else{
    console.log('Atualizado em %s comentado(não realizado):'.green, coll);
    // return client.db(db).collection(coll).updateOne(query, options)
  }
}


// Update de informações. Necessário Parametros senão todo o banco é atualizado
// O padrão é [{"Chave" : "Valor"}, {"Chave" : "Valor"}]
updateMany = (client, db, coll, query, options) => {
  if(options == 'undefined'){
    console.log('Atualizado em %s:'.green, coll);
    return client.db(db).collection(coll).updateMany(query)
  }
  else{
    console.log('Atualizado em %s:'.green, coll);
    return client.db(db).collection(coll).updateMany(query, options)
  }

}


// Delete informações. Necessário Parametros
deleteOne = (client, db, coll, query, options) => {
  if(options == 'undefined'){
    console.log('Deletado em %s:'.red, coll);
    return client.db(db).collection(coll).deleteOne(query)
  }
  else{
    console.log('deletado em %s:'.red, coll);
    return client.db(db).collection(coll).deleteOne(query, options)
  }
}


// Delete informações. Necessário Parametros
// O padrão é [{"Chave" : "Valor"}, {"Chave" : "Valor"}]
deleteMany = (client, db, coll, query, options) => {
  if(options == 'undefined'){
    console.log('Deletado em %s:'.red, coll);
    return client.db(db).collection(coll).deleteMany(query)
  }
  else{
    console.log('deletado em %s:'.red, coll);
    return client.db(db).collection(coll).deleteMany(query, options)
  }
}



/* ---------------- Uso Interno - Funções check ---------------- */


// Check objetos vazios
objEmpty = obj => {
  for(key in obj){
    if(obj.hasOwnProperty(key)){
      return false;
    }
  }
  return true;
}

// Retorna true se a wallet for desconhecida
unknownWallet = (wallet) => {

  let result;

  if (typeof(wallet) == 'string' && wallet.length == 34 )  {

    // valores do bando de dados
    let d = conf.db;
    let db = d.base[0]
    let coll = d.coll[0]

    // Busca a wallet informada
    console.log('unknownWallet:'.blue, 'Procurando com findOne:'.green, wallet);

    // Organizar a projection para o conf.js
    return new Promise(async res => {
      let result = await findOne(db, coll, { _id: wallet }, { projection:{ '_id': 1} });
      res(result);

    }).then( async res => {

      // Se a wallet não estiver cadastrada então ela é desconhecida
      if(res == null)
        return true;
      else
        return false;

    }).then( res => {
      // Saída
      return res;
    });

  }
  else{
    console.log('unknownWallet:'.blue,'Valor inválido'.red, typeof(wallet));
    return 0;

  }
}


/* ---------------- Uso Interno - Funções intermediárias ---------------- */


// Insere wallets informadas pelo usuários na fila de verificação
insertPendingWallet = (user_id, wallets) => {

  // Nome do Banco e da Collection
  let d = conf.db;
  let db = d.base[0];
  let coll = d.coll[2];

  new Promise((resolve, reject) => {
    if(Array.isArray(wallets)){

      // Instanciado antes do forEach
      let array = [];

      // Varre a array e insere cada elemento
      wallets.forEach( async element => {

        if(await unknownWallet(element))
          array.push(element);

        });
      resolve(array);
    }
    else if ( typeof(wallets) == 'string') {
      if (wallets.length == 34) {

        // Consulta se a array é conhecida
        let wallet = unknownWallet(wallets);

        // Retorna o resultado booleano
        resolve(wallet);
      }

    }
    else{
      console.log('insertPendingWallet:'.blue, 'Valor inválido '.yellow, typeof(user_id), typeof(array));
    }

  }).then( wallet => {

    delay(100).then( () => {

      if(Array.isArray(wallet)){

        // aramazena o objeto do modelo de dados
        wallet.forEach( (element, index, array) => {
          array[index] = conf.walletPending(user_id, element);

        });

        wallet.forEach(element =>{
          console.log('insertPendingWallet:'.blue,'Salvando:'.green, element.wallet);

        })

        // Insere em array
        insertMany(db, coll, wallet);
        console.log('insertPendingWallet:'.blue,wallet);

      }
      else if ( typeof(wallets) == 'string') {
        if ( typeof(wallet) == 'boolean') {

          let object = conf.walletPending(user_id, wallet);

          if( wallet ){
            console.log('Inserindo em %s:'.green, coll, wallet);
            // insertOne(db, coll, object);

          }
          else
            console.log('Existente em %s:'.yellow, coll, wallet);

        }
      }
    });

  }).catch( err => {
    console.log(err);

  });
}


//(VAZIO) Verifica novas wallets e geram novas fichas
checkPendingWallet = () => {

}


//(VAZIO) Verifica se o usuário confirmou a conta
checkPendingUser = () => {

}


/* ---------------- Exportações - Funções primárias ---------------- */

// Realiza busca de wallets e retorna
findWallet = async (wallet) => {

  if (typeof(wallet) === 'string') {

    // retorna a busca
    return await connect().then( async (res) => {

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

// Busca e retorna usuários de acordo com o nome do usuário
findUser = (username) => {

  let d = conf.db;
  let db = d.base[1];
  let coll = d.coll[1];

  if(typeof(username) == 'string'){

    query = {'username': username};
    // Inserir essa projeção no arquivo config
    projection = {
      projection:{
        '_id'     : 0,
        'username': 1,
        'email'   : 1,
        'passwd'  : 1 }
    };

    return findOne(db, coll, query, projection);

    // return new Promise((resolve, reject) => {
    //
    //   console.log('findUser:'.blue, 'Salvando:'.green, );
    //   let result = findOne(db, coll, query, projection);
    //   resolve(result);
    //
    // }).catch( err => {
    //   console.log('findUser'.blue,'Error em Promisse:'.yellow, user);
    //   return err;
    // });
  }
  else{

    console.log('findUser'.blue,'Objeto inválido:'.yellow, user);
    // Valores inválidos retornam null
    return null;

  }

}

findUserById = (id) => {
  const ObjectId = require("mongodb").ObjectId;

  let d = conf.db;
  let db = d.base[1];
  let coll = d.coll[1];

  if(typeof(id) == 'string'){

    query = {'_id': ObjectId(id)};
    // Inserir essa projeção no arquivo config
    projection = {
      projection:{
        '_id'     : 1,
        'username': 1,
        'email'   : 1,
        'passwd'  : 1 }
    };

    return new Promise((resolve, reject) => {

      console.log('findUser:'.blue, 'Salvando:'.green, );
      let result = findOne(db, coll, query, projection);
      resolve(result);

    }).catch( err => {
      console.log('findUser'.blue,'Error em Promisse:'.yellow, user);
      return err;
    });
  }
  else{

    console.log('findUser'.blue,'Objeto inválido:'.yellow, user);
    // Valores inválidos retornam null
    return null;

  }

}

// Insere wallet no banco.
// O objeto precisa estar no padrão do banco
insertWallet = (obj) => {

  let log_name = 'insertWallet:';
  let d = conf.db;
  let db = d.base[0];
  let coll = d.coll[0];

  if(typeof(obj) === 'object'){

    // Retorna o a inserção
    return new Promise((resolve, reject) => {

      // Se a wallet existe então true
      let check = objEmpty(obj._id);

      resolve(check);

    }).then( res => {

      // Se check for false então insere a wallet
      if(!check){
        console.log(colors.blue(log_name),'Salvando em %s:'.green, coll, obj._id);
        // insertOne( db, coll, obj);
        console.log('res', res);
      }
      else
        console.log(colors.blue(log_name),'Existente em %s:'.red, coll, obj._id,);

    }).catch( err => {
      console.warn(colors.blue(log_name),'Erro:\n'.red, err);
    });

  }
  else{
    console.log(colors.blue(log_name),'Valor inválido:'.yellow, typeof(obj));
    return null;
  }
}

// Insere usuários no banco
insertUser = async (user) => {

  // Endereço do banco
  let d = conf.db;
  let db = d.base[1];
  let coll = d.coll[1];

  if(typeof(user) == 'object' ){
    if(typeof(user.username) == 'string'){

      // Promisse para criptografar a senha do usuário
      bcrypt.hash( user.passwd, conf.bcrypt.saltRounds())
      .then( hash => {

        return hash;

      }).then( value => {

        user.passwd = value;

      }).then( () => {
        console.log('insertUser:'.blue, 'Salvando:'.green, user.username);
        insertOne(db, coll, user);

      }).then( async () => {
        // Busca as finformações inseridas no banco
        let result = await findOne(db, coll, { }, { projection:{ '_id': 1, 'wallets': 1 } })
        return result;

      }).then( async res => {

        console.log(res);
        // Insere as wallets informadas pelo usuário na collection  de pendencias
        if(res.wallets.length > 0){
          await insertPendingWallet(res._id, res.wallets);
        }

      }).catch( err => {
        console.log(err);

      });

    }
    else{
      console.log('insertUser'.blue,'Objeto inválido:'.yellow, user);
    }
  }
  else{
    console.log('insertUser'.blue,'Valor inválido:'.red, typeof(user));
    // Valores inválidos retornam nulo
    return null;
  }

}

// (VAZIO) Atualiza transações da wallet
updateWallet = (wallet) =>{

}

// (VAZIO) Atulaliza informações do usuário
updateUser = (user) =>{

}



/* ---------------- Exportações ---------------- */

// wallets
module.exports.findWallet = findWallet;
module.exports.insertWallet = insertWallet;
// module.exports.updateWallet = updateWallet;

// users
module.exports.findUser = findUser;
module.exports.insertUser = insertUser;
// module.exports.updateUser = updateUser;

//Temporario
module.exports.global = global;
module.exports.findOne = findOne;
module.exports.findToArray = findToArray;
module.exports.unknownWallet = unknownWallet;
