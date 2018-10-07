'use strict';

/* -------------------variaveis de configuração------------------- */

// Database
const db = {

  // Variaveis
  host   : 'mongodb://localhost:27017/',
  base   : ['wallet','users'],
  coll   : ['wallet', 'users','owner', 'pending'],
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
const tx = (addr, value, spent) =>{
  return {
    "addr"  : addr,
    "value" : value,
    "spent" : spent
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

 const user = (user, passwd) => {
   return {
     "ver"      : 1,
     "user"     : user,
     "passwd"   : passwd,
     "wallet"   : [],
     "rate_avg" : '',
     "rate"     : []
   }
 };

// Dados para teste
const data = () => {
  return [{user: 'luiz', passwd: 'abc123'},
    {user: 'Natália', passwd: 'abcd12'}]
}


/* -------------------Exportações------------------- */
module.exports.db = db;
module.exports.model = model;
module.exports.wallet = wallet;
module.exports.txs = txs;
module.exports.tx = tx;
module.exports.user = user;
// Data exporta os dados de teste
module.exports.data = data;
