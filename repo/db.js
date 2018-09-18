var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dotenv = require('dotenv').load();

// ---------------- Variaveis ----------------
// Dados de configuração do Banco
// Os valores do dotenv não são enviados com module.exports (veriicar)

const conf = {
  host  :  process.env.HOST, //endereço do banco:porta/database
  db    :  process.env.DB, //nome da database
  col   :  process.env.COLLECTION //A collection que deseja manupular
}

const btc_conf = {
  host  :  process.env.BTC_HOST,  //endereço do banco:porta/database
  db    :  process.env.BTC_DB, //nome da database
  col   :  process.env.BTC_COLL_WALLET //A collection que deseja manupular
}

// ---------------- Uso Interno - Promise ----------------


// Promise inicia a conexão
const connect = () => {
  return new Promise( (resolve, reject) => {
    MongoClient.connect(btc_conf.host, { useNewUrlParser: true }, (err, client) => {
      assert.equal(null, err);
      console.log('Conexão aberta');
      resolve(client);
    });
  })
}


// ---------------- Uso Interno - Funções ----------------


// Fechar a conexão
close = (db) => {
  return db.then( client => {
    console.log('Conexão fechada');
    client.close();
  })
}


// Retorno de array de busca
findToArray = (client) => {
  return client.db(btc_conf.db).collection(btc_conf.col).find().toArray();
}


// Insere um objeto por vez
// O metodo padrão é {"chave" : "Valor"}
insertOne = (client, res) => {
  return client.db(btc_conf.db).collection(btc_conf.col).insertOne(res);
}


// Insere uma array de Objetos
// O padrão é [{"Chave" : "Valor"}, {"Chave" : "Valor"}]
insertMany = (client, res) => {
  return client.db(btc_conf.db).collection(btc_conf.col).insertMany(res);
}


// ---------------- Exportações - Funções ----------------

// Deve realizar uma busca no banco e devolver os valores

search = (db) => {
  return db.then( client => {
    return findToArray(client);
  }).then(itens => {
    console.log(itens);
  }).then(() => {
    close(db);
  }).catch(err => {
    console.warn('Erro no search:\n', err);
  });
}


// Insert - Inserir novos valores no Banco

insert = (db, res) => {
  let founds;
  return db.then( client => {

    // Existe a função inserMany que poderia inserir toda
    // A Array, mas antes é necessário criar um filtro Parametros
    // Verificar se a carteira existe
    for(count in res.in){
      console.log(res.in[count]);
      insertOne(client, res.in[count]);
    }

  }).then(() => {
    close(db);
  }).catch(err => {
    console.warn('Erro no Insert:\n',err);
  });
}


// Retona os valores existentes no banco

existentes(){}


// Retona os valores inexistentes no banco

candidatos(){}

// ---------------- Exportações ----------------

// Valores
module.exports.conf = conf;
module.exports.btc_conf = btc_conf;
// Função
module.exports.connect = connect;
module.exports.search = search;
module.exports.insert = insert;
