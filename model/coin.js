// Implentação do modelo para BTC
'use strict';
// ---------------- Required ----------------
// Required - exports by npm
const rest = require('./rest');
const https = require('https');

// Retorno dos endereços
const url = (value1, value2, value3) => {

    // O endereço de acesso deve ser configurado aqui
    let hostname = 'https://blockchain.info/';

    if(value3)
      hostname += value1 + '/' + value2 + '/' + value3;
    else if(value2)
      hostname += value1 + '/' + value2;
    else if(value1)
      hostname += value1;

    return hostname;

}



// Url para acesso ao blockchain
const btc = {

  // Retorna JSON de uma transação simples
  tx              : (hash) => {
    return rest.req(url('rawtx', hash));
  },


  // Retorno multiplas transações desordenada
  multiaddress    : (array) => {
    // Sequencia de muitas arrays
    let wallets = 'multiaddr?active=';

      array.forEach( async (element, index) => {
        if(index > 0)
          wallets =+ '|';
        wallets =+ element;
      })

    return rest.req(url(wallets));
  },


  // Retorna JSON das transações em um bloco
  block           : (hash) => {
    return rest.req(url('rawblock', hash));
  },


  // Retorna JSON das transações de uma carteira
  address         : (wallet) => {
    return rest.req(url('rawaddr', wallet));
  },


  //Retorno JSON com o saldo da carteira
  balance         : (wallet) => {
    wallet = 'balance?active=' + wallet;
    return rest.req(url(wallet));
  },




  // ---------------- Real-Time ----------------

  // Retorno da lista de Blocos disponiveis e os seus hash
  // Foi necessário inserir um timeStamp 1535416365158 da data de 28/08/2018
  getblocks       : () => {
    return rest.req(url( 'blocks', '1535416365158' + '?format=json'));
  },


  // Current difficulty target as a decimal number
  // Valor da dificuldade em decimal
  getdifficulty   : () => {
    return rest.req(url( 'q',  'getdifficulty'));
  },


  // Current block height in the longest chain
  // Retorna o valor do ultimo bloco
  getblockcount   : () => {
    return url('q', 'getblockcount');
  },


  // Hash of the latest block
  // Hash do ultimo bloco
  latesthash      : () => {
    return url('q', 'latesthash');
  },


  // Retorna o ultimo bloco sendo processado
  latestblock     : () => {
    return url('latestblock');
  },


  // Current block reward in BTC
  // Valor da recompensa do bloco em BTC
  bcperblock      : () => {
    return url('q', 'bcperblock');
  },


  // Total Bitcoins in circulation (delayed by up to 1 hour])
  // Total de Bitcoins em circulação
  totalbc         : () => {
    return url('q', 'totalbc');
  },


  // Probability of finding a valid block each hash attempt
  // Probabilidade de encontrar um bloco válido
  probability     : () => {
    return url('q', 'probability');
  },


  // Average number of hash attempts needed to solve a block
  // Media do numero de tentativas de necessários para resolver um bloco
  hashestowin     : () => {
    return url('q', 'hashestowin');
  },


  // Block height of the next difficulty retarget
  // Valor da dificuldade para a dificuldade do proximo bloco
  nextretarget    : () => {
    return url('q', 'nextretarget');
  },


  // Average transaction size for the past 1000 blocks.
  // Change the number of blocks by passing an integer as the second argument
  // e.g. avgtxsize/2000
  avgtxsize       : () => {
    return url('q', 'avgtxsize');
  },


  // Average transaction value (1000 Default)
  avgtxvalue      : () => {
    return url('q', 'avgtxvalue');
  },


  // average time between blocks in seconds
  interval        : () => {
    return url('q','interval');
  },


  // estimated time until the next block (in seconds)
  eta             : () => {
    return url('q', 'eta');
  },


  //Average number of transactions per block (100 Default)
  avgtxnumber     : () => {
    return url('q', 'avgtxnumber');
  },


  // ---------------- info transactions ----------------

  // txtotalbtcoutput/TxHash - Get total output value of a transaction (in satoshi)
  txtotalbtcoutput: (hash) => {
    return url('txtotalbtcoutput', hash);
  },


  // txtotalbtcinput/TxHash - Get total input value of a transaction (in satoshi)
  txtotalbtcinput: (hash) => {
    return url('txtotalbtcinput', hash);
  },


  // txfee/TxHash - Get fee included in a transaction (in satoshi)
  txfee          : (hash) => {
    return url('q', 'txfee', hash);
  },


  // txresult/TxHash/Address - Calculate the result of a transaction sent or
  // received to Address. Multiple addresses separated by |
  txresult       : (hash, address) => {
    return url('txresult', hash , address);
  },





  // ---------------- converter and returns ----------------

  // Converter o valor Hash para Address
  hashtoaddress  : (hash160, callback) => {
    hash160 = hash160 + '?format=json';
    hash160 = url('q', 'hashtoaddress', hash160);
    let data = '';

    https.get(hash160, res => {
      console.log('statusCode:', res.statusCode);

      res.on('data', value => {
        data += value;
      });

      res.on('end', () => {

        if(res.statusCode == 200) {
          callback(data)
        }
        else if(res.statusCode == 500) {
          callback(false)
        }


      })

      res.on('error', err => {
        console.error(err);
      });
    });
  }

};

module.exports.btc = btc;
