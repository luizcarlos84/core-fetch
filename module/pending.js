const colors = require('colors');

const pattern = require('./pattern');
const db = require('../db/db');
const query = require('../db/query.js');
const conf = require('../conf/conf');


/* Verificar carteiras inseridas pelo usuário no frontFetch
   e em seguida realiza o procedimento de busca e inserção
   no banco
*/


var wallet = () => {

  let db0 = conf.db.base[0], //base - wallet
      coll0 = conf.db.coll[0], //coll - wallet
      q0 = {},
      options0 = {},
      coll2 = conf.db.coll[2], //coll - pending
      q2 = {},
      options2 = {};

  let checkPending = (err, doc) => {

    q0 = {$or: [{'_id': {$eq : doc.wallet}}, {'hash160': {$eq : doc.wallet}}]}
    query.findWallet(doc.wallet, {}, (err, doc1) => {

      // Se a wallet existe
      if(doc1){

        // Se houver proprietario
        if (doc1.owner){

          // Se o solicitante for o proprietario
          if(doc._idUser.equals(doc1.owner))
            console.log('pending.wallet:'.blue, doc1._id,'é de sua propriedade'.yellow);

          else{
            console.log('pending.wallet:'.blue, doc1._id, 'possui outro proprietario'.yellow);

            // Remove a wallet da array do usuário
            query.deleteWalletUser( doc._idUser, doc.wallet )

          }

          // Remove um documento em wallet.pending
          query.deletePending( doc._idUser, doc.wallet );
        }
        else{
          // Insere o ID do solicitante
          db.findOneAndUpdate(db0, coll0, q0, { $set: { 'owner': doc._idUser} }, {});
          console.log('pending.wallet:'.blue, 'Proprietário inserido');

          // Remove do Pending
          query.deletePending( doc._idUser, doc.wallet );

        }
      }
      else {
        // Insere uma nova
        coin.btc.address( doc.wallet )
        .then( res => {
          q0 = pattern.wallet( res, doc._idUser );
          db.insertOne(db0, coll0, q0);

          // Remove do Pending
          query.deletePending( doc._idUser, doc.wallet );

        })
        console.log('pending.wallet:'.blue, 'Carteira Inserida');
      }
    })
  }//checkPending

  /* Realiza busca em wallet.pendig para encontrar carteiras solicitadas */

  db.findToArray(db0, coll2, q2, options2, (err, array) => {

    if(array.length > 0){

      array.forEach( (doc, index) => {

        /* O Objetivo é que cada valor na array tenha um espaço de tempo
        para a execução. Então cada elemento tera um espaço de 10 segundos*/

        if(element)
          setTimeout(() => {query.checkPending(err, doc)}, 10000 * index)
          // query.checkPending(err, element);

        else
          console.log('pending.wallet:'.blue, 'Elemento vazio'.red);

      }); // array.forEach
    } // if(array.length > 0)

    else
      console.log('pending.wallet:'.blue, 'Sem Carteiras');

  }); // db.findToArray

} // wallet

module.exports.wallet = wallet;
