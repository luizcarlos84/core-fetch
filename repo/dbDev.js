// ---------------- Required ----------------
// Required - exports by npm
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dotenv = require('dotenv').load();


// ---------------- Variaveis ----------------
// Dados de configuração do Banco
// Os valores do dotenv não são enviados com module.exports (veriicar)
const conf = {
  host      :  process.env.HOST || 'mongodb://localhost:27017/test', //endereço do banco:porta/database
  db        :  process.env.DB ||'base', //nome da database
  collection:  process.env.COLLECTION || 'info' //A collection que deseja manupular
}

// ---------------- Promise ----------------

// Instanciar Promise e abre a conexão com o banco
const dbClient = new Promise( (resolve, reject) => {
  MongoClient.connect(conf.host, { useNewUrlParser: true }, (err, client) => {
    assert.equal(null, err);
    // console.log('\nConectado com sucesso');
    resolve(client);
  });
})


// ---------------- Funções manupulação dados ----------------

// Busca em array
const search = (busca) => {
  dbClient.then((client) => {
    client.db(conf.db).collection(conf.collection)
      .find({ product : busca }).toArray( (err, res) => {
        if (err) throw err;
        console.log(res);
      })
      client.close();
  }).catch(err => {
    console.log('Erro no search: ', err);
  })
}

// Retorna o primeiro objeto na collection
const searchOne = () => {
  dbClient.then((client) => {
    client.db(conf.db).collection(conf.collection)
      .findOne({} , (err, res) => {
        if (err) throw err;
        for(name in res)
          console.log(res[name]);
        client.close();
      })
  }).catch((err) =>{
    console.log('Erro no show: ', err);
  })
}

const searchFull = () => {
  dbClient.then((client) => {
    client.db(conf.db).collection(conf.collection)
      .find({}).toArray( (err, res) => {
        if (err) throw err;
        console.log(res);
      })
      client.close();
  }).catch(err => {
    console.log('Erro no search: ', err);
  })
}

// A função object.lenght não funciona, então conte "manualmente"
size = (json) => {
  let n = 0;
  for(name in json)
    if( typeof(json[name]) === 'object' ){
      n += size(json[name]);
    }
    else
      n++;
  console.log('Tamanho ', n);
  return n;
}

// ---------------- Funções Diversas ----------------

// Indexes
// O $index precisa estar como objeto como na URL
// https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/
// https://www.w3resource.com/mongodb/shell-methods/collection/db-collection-createIndex.php
indexCollection = (collection, index) => {
  collection.createIndex(index, (err, res) => {
      assert.equal(null, err);
      console.log(res); // mostra os index criados
  })
}

//Exports function
module.exports.search = search;
module.exports.searchOne = searchOne;
module.exports.searchFull = searchFull;
module.exports.indexCollection = indexCollection;


// ---------------- Desenvolvimento ----------------

// Em Desenvolvimento - Comentar codigos abaixo antes de executar

// // updateOne
// // Object precisa estar como JSON $filter = {nome: 'foo', end: 'bar'}
// //.updateOne possue duas variaveis: filter e value
//
// updateOne = (filter, value) => {
//   db.connect.then((client) => {
//     client.db(conf.db).collection(conf.collection)
//       .updateOne( filtro, (err, res) => {
//         if (err) throw err;
//         console.log(value);
//         client.close();
//       })
//     }).catch((err) => {
//       console.log('Erro no updateOne: ', err);
//     })
// }
