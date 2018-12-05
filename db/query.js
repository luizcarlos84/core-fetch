const db = require('./db');
const conf = require('../conf/conf');


/* Retorna usuário pelo username */

var findUser = (username, options, callback) => {

  let db1 = conf.db.base[1], //base - user
      coll1 = conf.db.coll[1], //coll - user
      query0 = {username: {$eq : username}};

  db.findOne(db1, coll1, query0, options,(err, doc) => {
    callback(err, doc);
  });
}





/* Retorna usuário pelo ID */

var findUserById = (id, options, callback) => {

  let db1 = conf.db.base[1], //base - user
      coll1 = conf.db.coll[1]; //coll - user

  // necessário pois o ID não é um string
  if(typeof(id) == 'object')
    query0 = {_id: {$eq : id}};
  else
   query0 = {_id: {$eq : ObjectId(id)}};

  db.findOne(db1, coll1, query0, options,(err, doc) => {
    callback(err, doc);
  });
}



/* Retorna uma carteira */

var findWallet = (wallet, options, callback) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0], //coll - wallet
      query0 = {$or: [{_id: {$eq : wallet}}, {hash160: {$eq : wallet}}]};

  db.findOne(db1, coll1, query0, options,(err, doc) => {
    callback(err, doc);
  });
}





/* Retorna uma array carteira */

var findWalletToArray = (query, options, callback) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0]; //coll - wallet

  db.findToArray(db1, coll1, query, options,(err, doc) => {
    callback(err, doc);
  });
}

var findWalletInScore = (query, options, callback) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0]; //coll - wallet

  db.findToArray(db1, coll1, query, options,(err, doc) => {
    callback(err, doc);
  });
}

var findWalletInUpdate = (query, options, callback) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0]; //coll - wallet

  db.findToArray(db1, coll1, query, options,(err, doc) => {
    callback(err, doc);
  });
}



var findWalletAndUpdateTXs = ( doc ) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0], //coll - wallet
      query0 = {$or: [{_id: {$eq : doc._id}}, {hash160: {$eq : doc._id}}]};


  findWallet(doc._id, {}, (err, doc1) => {

    let update1 = {
            $pullAll: {
              "txs": doc1.txs
            }
          };

    db.findOneAndUpdate(db1, coll1, query0, update1, {upsert: true})
    console.log('findWalletAndUpdateTXs:'.blue, doc._id.substring(0,6) + '...', 'com transações atualizadas');


  });

  let update = {
          $push: {
            "txs": { $each : doc.txs }
          },
          $set: {
            n_tx: doc.n_tx
          }
        };

  db.findOneAndUpdate(db1, coll1, query0, update, {upsert: true})

}

var findWalletAndDeleteTXs = (doc) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0], //coll - wallet
      query0 = {$or: [{_id: {$eq : doc._id}}, {hash160: {$eq : doc._id}}]},
      update = {
        $pullAll: {
          "tsx": doc.txs
        }
      }

      db.findOneAndUpdate(db1, coll1, query0, update, {upsert: true})

}


/* Atualiza informações da carteira */

var updateWallet = (wallet, update) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0], //coll - wallet
      query0 = {$or: [{_id: {$eq : wallet}}, {hash160: {$eq : wallet}}]};

  db.findOneAndUpdate(db1, coll1, query0, update, {upsert: true});
}




/* Deleta um document da collection pending */

var deletePending = (id, wallet) => {

  let db0 = conf.db.base[0], //base - wallet
      db1 = conf.db.base[1], //base - user
      coll1 = conf.db.coll[1], //coll - user
      coll2 = conf.db.coll[2], //coll - pending
      query2 = {$and : [{'_idUser': {$eq: id}}, {'wallet': {$eq: wallet}}]};

  db.findOneAndDelete(db0, coll2, query2);
  console.log('deletePending:'.blue, wallet.substring(0,6) + '...' ,'removido de wallet.pending'.red);
}



/* Deleta uma carteira inserida no documento do usuário */

var deleteWalletUser = (id, wallet) => {

  let db0 = conf.db.base[0], //base - wallet
      db1 = conf.db.base[1], //base - user
      coll1 = conf.db.coll[1], //coll - user
      coll2 = conf.db.coll[2], //coll - pending
      filter = {},
      update = { $pull: {wallets: {$in: [wallet]}}};

  findUserById(id, {projection: {username:1, wallets: 1}}, (err, doc) => {

    if(doc){
      if(doc.wallets.find( element => {
        if(element == wallet);
        return true
      })){
        filter = {'_id': {$eq: doc._id}};
        db.findOneAndUpdate(db1, coll1, filter, update, {});

      }else{
        console.log('deleteWalletUser:'.blue, wallet.substring(0,6) + '...', 'não encontrado ou removido'.yellow );
      }
    }
    else{
      console.log('deleteWalletUser:'.blue, 'Usuário'.yellow, id, 'não encontrado'.yellow );
    }

  });
}

// find
module.exports.findUser = findUser;
module.exports.findUserById = findUserById;
module.exports.findWallet = findWallet;
module.exports.findWalletToArray = findWalletToArray;
module.exports.findWalletInScore = findWalletInScore;
module.exports.findWalletInUpdate = findWalletInUpdate;

// update
module.exports.updateWallet = updateWallet;
module.exports.findWalletAndUpdateTXs = findWalletAndUpdateTXs;

// delete
module.exports.deletePending = deletePending;
