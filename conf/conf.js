'use strict';

/* -------------------variaveis de configuração------------------- */

// Database
const db = {

  // Variaveis
  host   : 'mongodb://localhost:27017/',
  base   : ['wallet','users'],
  coll   : ['wallet', 'users','pending', 'owner'],
  adm    : ['config'],

  /* gets*/

  /* Host das carteiras*/
  hostwallet   : function(){
    return this.host + this.base[0];
  },

  /* host dos usuários */
  hostuser     : function(){
    return this.host + this.base[1];
  },
};

/* -------------------Modelo de manupulação de dados-------------------

conf     : variáveis de configuração
data     : Objeto com os dados para manipulação
fetch    : Retorno de Solicitações externas
db       : Retorno de Informações armazenadas no banco
result   : Resultado de manipulação entre fetch e o db */

const model = () => {
  return {
       "conf"   : [],
       "fetch"  : [],
       "db"     : [],
       "res"    : [],
     };
};

/* -------------------Modelo de dados para wallets-------------------

_ID     : Será utilizado o address como ID único
owner   : identificador do dono no sistema
orphan  : Carteira sem dono identificado
miner   : Carteira de um possível mineiro
pool    : Carteira de um sistema de mineração em cooperação */


const wallet = (address, hash160, n_tx) => {
  return {
   "_id"      : address,
   "hash160"  : hash160,
   "ver"      : 1,
   "owner"    : "",
   "confirmed": false,
   "orphan"   : true,
   "miner"    : false,
   "pool"     : false,
   "n_tx"     : n_tx,
   "txs"      : []
 }
};

/* txs é inserido na array wallet.txs
timeStamp : o horario da transação
hash      : a identificação da transação
input/out : as transação de entrada e saída*/

const txs = (time,hash) => {
  return {
      "time"      : time,
      "hash"      : hash,
      "inputs"    : [],
      "out"       : []
  }
};

/* tx deve ser inserido na array wallet.txs.inputs ou wallet.txs.out */
const tx = (addr, value, spent) => {
  return {
    "addr"  : addr,
    "value" : value,
    "spent" : spent
  }
};

const walletPending = (idUser, wallet) => {
  return {
    "_idUser"   : idUser,
    "wallet"    : wallet,
  }
};


/* -------------------Modelo de dados para usuários-------------------

 ver       : 1,
 user      : "string",
 passwd    : "hash",
 wallet    : ["string"],
 rate_avg  : "var",
 rate      :
 */

 const user = (username, email, passwd) => {
   return {
     "ver"      : 1,
     "username" : username,
     "email"    : email,
     "passwd"   : passwd,
     "wallets"  : [],
     "rate_avg" : -1,
     "rate"     : []
   }
 };

 /* -------------------projection------------------- */

const walletUserProj = () => {
  return { projection: {
   '_id'      : 1,
   'hash160'  : 1,
   'ver'      : 0,
   'owner'    : 0,
   'confirmed': 1,
   'orphan'   : 0,
   'miner'    : 0,
   'pool'     : 0,
   'n_tx'     : 1,
   'txs'      : 0
    }
  }
};

const walletOwnerProj = () => {
  return { projection: {
   '_id'      : 1,
   'hash160'  : 1,
   'ver'      : 0,
   'owner'    : 0,
   'confirmed': 1,
   'orphan'   : 1,
   'miner'    : 0,
   'pool'     : 0,
   'n_tx'     : 1,
   'txs'      : 1
    }
  }
};





/* -------------------Exportações------------------- */
module.exports.db = db;
module.exports.model = model;
module.exports.wallet = wallet;
module.exports.txs = txs;
module.exports.tx = tx;
module.exports.user = user;
module.exports.walletPending = walletPending;
