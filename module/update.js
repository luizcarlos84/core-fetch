const colors = require('colors');

const pattern = require('./pattern');
const db = require('../db/db');
const query = require('../db/query.js');
const conf = require('../conf/conf');
const coin = require('../model/coin');


/*
  Verifica as carteiras inseridas no banco estão com dados desatualizados
  se baseando no campo n_tx. Se o valor estiver diferente as transações
  na array txs são reorganizadas e reinseridas.
*/

wallet = () => {

  let q0 = {}, //query para wallet
      options0 = {projection: {_id:1, hash160: 1, owner: 1, n_tx: 1}}; //options para wallet

  let checkUpdate = (doc) => {

    coin.btc.address( doc._id )
    .then( res => {

      if(res.n_tx == doc.n_tx)
        console.log('wallet.checkUpdate'.blue, doc._id.substring(0,6) + '...', 'Sem atualizações');

      else{
        console.log('wallet.checkUpdate'.blue, doc._id.substring(0,6) + '...', 'com novos dados existentes');
        query.findWalletAndUpdateTXs( pattern.wallet(res, doc.owner) )
      }


    }).catch( err => {
      console.log('wallet.checkUpdate'.blue, 'error\n'.red, err);

    });

  } // checkUpdate



  /* A função se inicia realizando uma busca de todas as carteiras
    no banco e dividindo dua execução em camada de tempo.
  */
  query.findWalletInUpdate(q0, options0, (err, array) => {

    array.forEach( (doc, index) => {

      if(doc){

        setTimeout(() => {checkUpdate(doc)}, 5000 * index)

      }
    })

  }); // query.findWalletToArray



} // wallet

module.exports.wallet = wallet;
