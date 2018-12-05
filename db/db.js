/* ---------------- Required ---------------- */

// // Required - exports by npm
const bcrypt = require('bcrypt');
const colors = require('colors');
const dotenv = require('dotenv').load();
const MongoClient = require('mongodb').MongoClient;

// // Required - customs exports
const conf = require('../conf/conf');


/* ---------------- Uso Interno - Promise ---------------- */


const connect = (url, callback) => {

  return MongoClient.connect(url, {useNewUrlParser: true }, (err, client) => {
   if(err) return console.log('error:',err);
   console.log('MongoDB:'.blue,'Conexão aberta'.green);
   callback(client);
  })
}


/* ---------------- Uso Interno - Funções CRUD ---------------- */

// Query = { campo : valor}
var findOne = (db, coll, query, options, callback) => {

  connect(conf.db.hostwallet(), client => {

    console.log('MongoDB:'.blue,'findOne: DB:'.green, db, 'Collection:'.green, coll);

    client.db(db).collection(coll).findOne( query, options, (err, doc) => {
      if(err)
        return console.log('MongoDB:'.blue,'Erro em findOne\n'.red ,err);

      callback(err, doc);
      client.close();
      console.log('MongoDB:'.blue,'findOne: Conexão fechada'.green);
    });
  })
}


// Query = { campo : valor}
var findToArray = (db, coll, query, options, callback) => {

  connect(conf.db.hostwallet(), client => {

    console.log('MongoDB:'.blue,'findToArray: DB:'.green, db, 'Collection:'.green, coll);

    client.db(db).collection(coll).find(query, options).toArray( (err, doc) => {
      if(err)
        return console.log('MongoDB:'.blue,'Erro em findToArray\n'.red ,err);

      callback(err, doc);
      client.close();
      console.log('MongoDB:'.blue,'findToArray: Conexão fechada'.green);
    });
  })
}


// Query = { campo : valor}
var insertOne = (db, coll, query, options) => {

  connect(conf.db.hostwallet(), client => {

    console.log('MongoDB:'.blue,'insertOne: Salvando em:'.green, coll);

    client.db(db).collection(coll).insertOne( query, options, (err, doc) => {
      if(err)
        return console.log('MongoDB:'.blue,'Erro em insertOne\n'.red ,err);

      client.close();
      console.log('MongoDB:'.blue,'insertOne: Conexão fechada'.green);
    });
  })
}


// PROBLEMA - Evite usar
// array = [{ campo : valor}, { campo : valor}]
// options = {ordered: false}
var insertMany = (db, coll, array, options) => {

  try {
    connect(conf.db.hostwallet(), client => {

      console.log('MongoDB:'.blue,'insertMany: Salvando em:'.green, coll);

      client.db(db).collection(coll).insertMany( array, options, (err, doc) => {
        if(err)
          console.log('MongoDB:'.blue,'Erro em insertMany\n'.red ,err);

        client.close();
        console.log('MongoDB:'.blue,'insertMany: Conexão fechada'.green);
      });
    })

  } catch (err) {
    console.log('MongoDB:'.blue,'Erro em insertMany\n'.red ,err);
  }
}


// filter = { teste : { $eq: 01}} - valores do campo igual a 01
// update = { $set: {teste: 02} } - modificar o valor de teste para 02
var findOneAndUpdate = (db, coll, filter, update, options) => {

  connect(conf.db.hostwallet(), client => {

    console.log('MongoDB:'.blue,'findOneAndUpdate: Salvando em:'.green, coll);

    client.db(db).collection(coll).findOneAndUpdate( filter, update, options, (err, doc) => {
      if(err)
        return console.log('MongoDB:'.blue,'Erro em findOneAndUpdate\n'.red ,err);

      client.close();
      console.log('MongoDB:'.blue,'findOneAndUpdate: Conexão fechada'.green);
    });
  })
}


var findOneAndDelete = (db, coll, filter, options) => {

  connect(conf.db.hostwallet(), client => {

    console.log('MongoDB:'.blue,'findOneAndDelete: Salvando em:'.green, coll);

    client.db(db).collection(coll).findOneAndDelete( filter, options, (err, doc) => {
      if(err)
        return console.log('MongoDB:'.blue,'Erro em findOneAndDelete\n'.red ,err);

      client.close();
      console.log('MongoDB:'.blue,'findOneAndDelete: Conexão fechada'.green);
    });
  })
}



module.exports.findOne = findOne;
module.exports.findToArray = findToArray;
module.exports.insertOne = insertOne;
module.exports.insertMany = insertMany;
module.exports.findOneAndUpdate = findOneAndUpdate;
module.exports.findOneAndDelete = findOneAndDelete;
