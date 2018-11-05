/* ---------------- Required ---------------- */

// // Required - exports by npm
const assert = require('assert');
const colors = require('colors');
const dotenv = require('dotenv').load();
const MongoClient = require('mongodb').MongoClient;

// // Required - customs exports
const conf = require('./conf/conf');
const coin = require('./model/coin');
const db = require('./repo/db');
const rest = require('./model/rest');

/* ---------------- Variables ---------------- */

var model = conf.model();

/* ---------------- Funções ---------------- */


/* Prepara os dados obtidos para o modelo de dados do Banco
   Retorna o valor para dentro do objeto model conforme esquema

model = {
     "conf"  : [],
     "fetch"  : [ consulta ],
     "db"     : [],
     "result" : [ saída ]
};
*/
walletPattern = (array) => {

  try {

    if(Array.isArray(array)){

      // Retorna o valor da função
      let result = [];

      for(p_fetch in array){
        // Resume o valor adiquirido
        let r_fetch = array[p_fetch];

        // Instancia o objeto wallet
        let wallet = conf.wallet(r_fetch.address, r_fetch.hash160,r_fetch.n_tx)

        for(p_txs in r_fetch.txs){
          // Resume o valor adiquirido
          let r_txs = r_fetch.txs[p_txs];

          // Instancia o objeto de transações
          let txs = conf.txs(r_txs.time,r_txs.hash);


          for(p_inputs in r_txs.inputs){
            // Resume o valor adiquirido
            let r_inputs = r_txs.inputs[p_inputs].prev_out;

            // Instancia o objeto para enviar a wallet.txs.inputs
            let tx = conf.tx(r_inputs.addr,r_inputs.value,r_inputs.spent);

            // Insere como objeto na array wallet.txs.inputs
            txs.inputs.push(tx);
          }


          for(p_out in r_txs.out){
            // Resume o valor adiquirido
            let r_out = r_txs.out[p_out];

            // Instancia o objeto para enviar a wallet.txs.out
            let tx = conf.tx(r_out.addr,r_out.value,r_out.spent);

            // Insere como objeto na array wallet.txs.out
            txs.out.push(tx);

          }

          // Insere na array wallet.txs
          wallet.txs.push(txs);
        }

        // Inserir na array result
        result.push(wallet);
      }

      // Retornar o result
      return result;


    }
    else{
      console.log('Valor inválido em walletPattern');
      return 0;

    }

  } catch (err) {
    console.log('Erro na função walletPattern\n', err);
  }
}


/* Buscam por novas transações e invoca a insertWallet()

  Realiza busca no banco e analisa as carteiras
  Consulta as transações das carteiras que possuem proprietarios
  Verifica se a carteira existe no Banco
  se não existir invoca o insertWallet() e prossegue */

walletExplorer = (model) => {

    try {

      /* A carteira 1Dzhw2EwFPBpWVuKZqkya5deUqyUUrpsTj e a
         1KDEVePj4eL91ETBKs2HS74AoxABsPWHqe
         é apenas para teste. Nessa área deve ocorrer a Busca
         por carteiras na collection PENDING */

      coin.btc.rawaddr('13ceZUnVNPMNfY9X7fiiceyXUKk4YfrTvH')
      .then( res => {

        // Insere o valor na array de resultado
        model.fetch.push(res);

        // Padroniza os dados na array result
        model.res = walletPattern(model.fetch);

      }).then( res => {

        //Limpa o vetor
        model.fetch.splice(0);

        // Transfere do vetor de resultado para o de pesquisa
        model.res.forEach( obj => {
          model.fetch.push(obj);
        });

        // limpa o vetor de resultado
        model.res.splice(0);

        // Executa a função de inserção
        model.fetch.forEach( obj => {
            // console.log(obj);
            db.insertWallet(obj);
        });


      }).then( async () => {

        // Aguarda e retorna a busca no banco
          return await db.findWallet(model.fetch._id);

      }).then( res =>{

        // exibindo o resultado para testes
        console.log('retorno: ', res);

      }).catch(err =>{
        console.warn('Erro no promise rest.req em index.walletExplorer\n', err);
      })

    } catch (err) {
      console.warn('Erro na função index.walletExplorer\n', err);
    }

}



// Busca por novas transações para atualização das carteiras

blocksExplorer = () => {

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
    .then( res => {
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

      // // Solicita o hash do bloco baseado no s        console.log(x);eu height
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
      console.warn('Erro na promisse rest.req em index.blocksExplorer\n', err);
    });


  } catch (err) {
    console.log('Erro na função index.blocksExplorer\n', err);
  }
  // // Passo 2 consultar carteiras bloco para então criar ou atualizar

  // // Passo 3 Consultar se existe alguma carteira cadastrada

  // // Passo 3.1 Encontrando carteira, atualizar dados

  // // Passo 4 - Recalcular reputação

  // // Passo 5 Encerrar e consultar eta() para gerar delay

}

/* ---------------- Inicializando funções ---------------- */
walletExplorer(model);
// userPattern(model);
