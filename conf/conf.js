'use strict';

// configuração

const db = {

  // Variaveis
  hostname    : 'mongodb://localhost:27017/',
  base_index  : 'index',   // Nome da base de dados

  // gets
  host     : function(){
    return this.hostname + this.base_index;
  }

};

// Exports dos módulos
module.exports.db = db;
