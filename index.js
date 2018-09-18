// // ---------------- Required ----------------
// // Required - exports by npm
const dotenv = require('dotenv').load();
const express = require('express');
var route = express();
var MongoClient = require('mongodb').MongoClient;
// // Required - customs exports
const conf = require('./conf/conf');
const coin = require('./model/coin');
const rest = require('./model/rest');
const time = require('./model/timeStamp');
const db = require('./repo/db');

// // ---------------- Variables ----------------
// // Variables
var wallet = process.env.WALLET;
var hash = process.env.HASH

// // Objetos na busca
obj = { "_ID" : "5b777111ebcd8f1a5929b451" };
// // Variavel de busca
busca = 'Nexus One'
// // Parametros de indexaçãoptimize
// // Quais campos variaveis deverão ser indexadas
index = { tx_pos: 1 , product: 1 };

// // ---------------- Funções ----------------

explore = () => {

  // // Valor teste de um bloco
  let height = 538962;
  // // Valor teste de um Hash
  let hash;
  // // Valor teste de uma wallet(carteira)
  let wallet = '15L5wTYMfTjuZG6C1SCxRgXao5F8E2iX4u';

  // // Armazenamento de valores obtidos no blockchain
  let result = {
    in : [],
    out : []
  }

  // // Passo 01 Verificar todos os blocos e consultar o necessário
  try {
    // // Busca a hash e o height dos blocos
    rest.req(coin.btc.getblocks())
    .then( res =>{
      // // Realizar busca no banco comparando com existente
    }).then( res => {
      console.log('Extrato de Informações');

      // // Busca e retorna o hash do bloco
      for(blocks_pos in res.blocks){
        // // if retorna apenas o Hash da variavel "height"
        if(res.blocks[blocks_pos].height === height ){
          console.log('height: ' ,res.blocks[blocks_pos].height);
          console.log('hash: ',res.blocks[blocks_pos].hash);
          hash = res.blocks[blocks_pos].hash;
        }
      }
      // // Retorna o Valor da Hash para o proximo encadeamento
      return hash;

    }).then( res => {

      // // Deve serguir os seguintes passos:
      // // 1 - retornar com todas as carteiras do bloco
      // // 2 - comparar se há alguma carteira cadastrada
      // // 3 - realizar a atualização da carteira

      // // Solicita o hash do bloco baseado no seu height
      rest.req(coin.btc.rawblock(hash))
      .then( res => {

        // // Busca as transações no objeto "tx"
        for(tx_pos in res.tx){
          // // Armazena o objeto res.tx[pos array]
          let tx = res.tx[tx_pos];

          // // Titulo apenas para melhor orientação
          // // console.log('Res.Tx:\t',tx_pos);

          // // inputs da wallet
          for(inputs_pos in tx.inputs){

              // // Armazena o objeto res.tx[pos array].inputs[pos array]
              let inputs = tx.inputs[inputs_pos];

              if(typeof(inputs.prev_out) !== 'undefined'){
              // // A primeira entrada é o premio do bloco e não ha input.
              // // console.log('input ', inputs_pos, ':\t', inputs.prev_out.addr, '\tValue: ', inputs.prev_out.value*0.00000001);
              result.in.push({addr: inputs.prev_out.addr, value: inputs.prev_out.value});
            }
          }

          // // out da carteira
          for(out_pos in tx.out){

            // // Armazena o objeto res.tx[pos array].out[pos array]
            let out = tx.out[out_pos];

            if(typeof(out.addr) !== 'undefined'){
              if(tx_pos == 0){
                // // Posição do premio do bloco e a carteira do minerador
                // // console.log('miner ',out_pos,':\t', out.addr, '\tValue: ', out.value*0.00000001);
                result.out.push({miner: out.addr, value: out.value});
              }
              else{
                // // console.log('out ',out_pos,':\t', out.addr,'\tValue: ', out.value*0.00000001);
                result.out.push({addr: out.addr, value: out.value});
              }
            }
          }
        }

        // // Local para Retornar os valores armazenados
        // console.log(result.in);
        // console.log(result.out);
        return result;

      }).then( res => {
        // // Verificar se os valores chegaram
        console.log(res.in);
        console.log(res.out);

        // // Inserir os valores no banco de dados
        // db.insert(res);

      }).catch(err =>{
        console.warn(err);
      });

    }).catch( err => {
      console.warn('Erro: ', err);
    });


  } catch (err) {
    console.log('Erro na função explore() /n', err);
  }
  // // Passo 2 consultar carteiras bloco para então criar ou atualizar

  // // Passo 3 Consultar se existe alguma carteira cadastrada

  // // Passo 3.1 Encontrando carteira, atualizar dados

  // // Passo 4 - Recalcular reputação

  // // Passo 5 Encerrar e consultar eta() para gerar delay

}

// // ---------------- Inicializando funções ----------------
explore();
