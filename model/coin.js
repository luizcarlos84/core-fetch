// Implentação do modelo para BTC
'use strict';
// ---------------- Required ----------------
// Required - exports by npm
const rest = require('./rest');

// Url para acesso ao blockchain
const btc = {

  // Variaveis das funções
  var_hostname   : 'https://blockchain.info/',
  var_rawtx      : 'rawtx/',                  //Retorna JSON de uma transação simples
  var_rawblock   : 'rawblock/',               //Retorna JSON das transações em um bloco
  var_rawaddr    : 'rawaddr/',                //Retorna JSON das transações de uma carteira
  var_multiaddr  : 'multiaddr?active=',       //Retornar JSON com multiplas transações
  var_balance    : 'balance?active=',         //Retorno JSON com o saldo da carteira
  var_latestblock: 'latestblock',             //Retorna ultimo bloco
  var_query      : 'q/',                      //Parametros de consultas
  var_blocks     : 'blocks' ,                 //Parametros de retorno dos blocos
  var_json       : '?format=json',            //Solicitação em formato JSON

  // Retorna o host dentro das funções
  host: function(cmd){
    return this.var_hostname + cmd;
  },

  // Retorna JSON de uma transação simples
  rawtx      : function(var_hash){
    return this.host(this.var_rawtx) + var_hash;
  },

  multiaddr  : function(array_hash){
    let address = '';
    let count = 0;

      array_hash.forEach(value =>{
        if(count != 0)
          address =+ '|';
        address =+ value;
        count++;
      })

    return this.host(this.var_multiaddr) + address;
  },

  // Retorna JSON das transações em um bloco
  rawblock   : function(var_hash){
    return this.host(this.var_rawblock) + var_hash;
  },

  // Retorna JSON das transações de uma carteira
  rawaddr    : function(var_wallet){
    return this.host(this.var_rawaddr) + var_wallet;
  },

  //Retorno JSON com o saldo da carteira
  balance    : function(var_wallet){
    return this.host(this.var_balance) + var_wallet;
  },

  // ---------------- Real-Time ----------------

  // Retorno da lista de Blocos disponiveis e os seus hash
  // Foi necessário inserir um timeStamp 1535416365158 da data de 28/08/2018
  getblocks: function() {
    return this.host(this.var_blocks) + '/1535416365158' + this.var_json
  },

  // Current difficulty target as a decimal number
  // Valor da dificuldade em decimal
  getdifficulty: function(){
    return this.host(this.var_query) + 'getdifficulty';
  },

  // Current block height in the longest chain
  // Retorna o valor do ultimo bloco
  getblockcount: function(){
    return this.host(this.var_query) + 'getblockcount';
  },

  // Hash of the latest block
  // Hash do ultimo bloco
  latesthash: function() {
    return this.host(this.var_query) + 'latesthash';
  },

  // Retorna o ultimo bloco sendo processado
  latestblock: function(){
    return this.host(this.var_latestblock);
  },

  // Current block reward in BTC
  // Valor da recompensa do bloco em BTC
  bcperblock: function(){
    return this.host(this.var_query) + 'bcperblock';
  },

  // Total Bitcoins in circulation (delayed by up to 1 hour])
  // Total de Bitcoins em circulação
  totalbc: function(){
    return this.host(this.var_query) + 'totalbc';
  },

  // Probability of finding a valid block each hash attempt
  // Probabilidade de encontrar um bloco válido
  probability: function() {
    return this.host(this.var_query) + 'probability';
  },

  // Average number of hash attempts needed to solve a block
  // Media do numero de tentativas de necessários para resolver um bloco
  hashestowin: function() {
    return this.host(this.var_query) + 'hashestowin';
  },

  // Block height of the next difficulty retarget
  // Valor da dificuldade para a dificuldade do proximo bloco
  nextretarget: function(){
    return this.host(this.var_query) + 'nextretarget';
  },

  // Average transaction size for the past 1000 blocks.
  // Change the number of blocks by passing an integer as the second argument
  // e.g. avgtxsize/2000
  avgtxsize: function() {
    return this.host(this.var_query) + 'avgtxsize';
  },

  // Average transaction value (1000 Default)
  avgtxvalue: function() {
    return this.host(this.var_query) + 'avgtxvalue';
  },

  // average time between blocks in seconds
  interval: function(){
    return this.host(this.var_query) + 'interval';
  },

  // estimated time until the next block (in seconds)
  eta: function() {
    return this.host(this.var_query) + 'eta';
  },

  //Average number of transactions per block (100 Default)
  avgtxnumber: function() {
    return this.host(this.var_query) + 'avgtxnumber';
  },

  // ---------------- info transactions ----------------

  // txtotalbtcoutput/TxHash - Get total output value of a transaction (in satoshi)
  txtotalbtcoutput: function(hash){
    return this.host('txtotalbtcoutput/') + hash;
  },

  // txtotalbtcinput/TxHash - Get total input value of a transaction (in satoshi)
  txtotalbtcinput: function(hash) {
    return this.host('txtotalbtcinput/') + hash;
  },

  // txfee/TxHash - Get fee included in a transaction (in satoshi)
  txfee: function(hash){
    return this.host(this.var_query + 'txfee/') + hash;
  },

  // txresult/TxHash/Address - Calculate the result of a transaction sent or
  // received to Address. Multiple addresses separated by |
  txresult: function(hash, address) {
    return this.host('txresult/') + hash + '/' + address;
  },

  // ---------------- converter and returns ----------------

};

module.exports.btc = btc;
