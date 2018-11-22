/* ---------------- Required ---------------- */

// // Required - exports by npm
const assert = require('assert');
const colors = require('colors');
const dotenv = require('dotenv').load();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

// // Required - customs exports
const conf = require('./conf/conf');
const coin = require('./model/coin');
const db = require('./repo/db');
const rest = require('./model/rest');

/* ---------------- Funções externas ---------------- */

// Verificar carteiras inseridas pelo usuário.
var walletPending = () => {

  let db0 = conf.db.base[0], //base - wallet
      coll0 = conf.db.coll[0], //coll - wallet
      query0 = {},
      coll2 = conf.db.coll[2], //coll - pending
      query2 = {},
      options2 = {};


  db.findToArray(db0, coll2, query2, options2, (err, doc) => {

    if(doc){
      doc.forEach( element => {

        query0 = {$or: [{'_id': {$eq : element.wallet}}, {'hash160': {$eq : element.wallet}}]}
        findWallet(element.wallet, {}, (err, doc) => {

          if(doc){
            // Se a wallet existe

            if (doc.owner){
              // Verifica se possui dono
              console.log('walletPending:'.blue, doc._id, 'Possui proprietarios'.yellow);

              // Remove do Pending
              deletePending( element.wallet );
              // Remove carteira do usuário
              deleteWalletUser( element._idUser, element.wallet )

            }
            else{
              // Insere o ID do solicitante
              db.findOneAndUpdate(db0, coll0, query0, { $set: { 'owner': element._idUser} }, {});
              console.log('walletPending:'.blue, 'Proprietário inserido'.green);

              // Remove do Pending
              deletePending( element.wallet );


            }
          }
          else {
            // Insere uma nova
            coin.btc.rawaddr( element.wallet )
            .then( res => {
              query0 = walletPattern( res, element._idUser );
              db.insertOne(db0, coll0, query0);

              // Remove do Pending
              deletePending( element.wallet );

            })
            console.log('walletPending:'.blue, 'Carteira Inserida'.green);
          }
        })
      }); //doc.for each
    }
    else{
      console.log('walletPending:'.blue, 'Sem Carteiras em pending'.yellow);
    }

  }); //db.findToArray
}


/* Calcula com um valor entre 0 e 100 sobre o tipo de investidor
   baseado no TEMPO que ele retem uma quantia.
   * 0 ate 20 "conservador", até 60 "moderado" 50 a 100 "holder - Agressivo"
   * informar Data de inicio do investimento
*/
scoreHolder = (wallet) => {
  let exchange = [] //filtra e armazena as transações da busca em objetos,
      total = 0, // tempo de investimento somado todos os periodos
      parcial = 0, //armazena o tempo inicial de um deposito
      saldo = 0, //armazena um saldo quando depositado
      agora = Date.now()/1000, //tempo exato das transações (epoch)
      tempoInicial = 0, //Data primeira transação (epoch)
      tempoFinal = 0, //Data Ultima transação (epoch)
      periodo = [], // RESULTADO: armazena o período de cada transação normalmente o out é zero
      percent = [], // RESULTADO: armazena a percentagem a ser somada.
      score = 0; //RESULTADO: o valor do Score

  //
  var tempoScore = ( tempo ) => {

    // Transaforma em percentagem
    let percentagem = (tempo * 100)/ (tempoFinal - tempoInicial);


    // Utiliza uma função de desvio padrão. pode ser usado funções matermaticas
    // para dar maior pontuação a transações mais recentes.

    let variacao = ( (3 * percentagem) + 200 ) / 300; // função de 1º grau

    // Retorno COM variação
    // return (percentagem * variacao)

    // Retorno SEM variação
    return ( percentagem );
  }

  findWallet(wallet, {
    projection: {
    '_id'  : 1,
    'owner': 1,
    'score': 1,
    'n_tx' : 1,
    'txs'  : 1}}, (err, doc) => {

      doc.txs.forEach(element => {

        element.inputs.forEach(element1 => {

          if(element1.addr == doc._id){
            op = {'time':element.time, 'input':element1.value}
            exchange.push(op);
          }
        });

        element.out.forEach(element1 => {

          if(element1.addr == doc._id){
            op = {'time':element.time, 'out':element1.value}
            exchange.push(op);
          }
        });
      })
      // Colocar na ordem do mais antigo ao mais recente
      exchange.reverse();

      // As arrays com os objetos usam map para criar uma array de variavel time
      tempoFinal = Math.max.apply(Math, exchange.map( x => {return x.time}));
      tempoInicial = Math.min.apply(Math, exchange.map( x => {return x.time}));

      exchange.forEach( (element, index) => {

        if (element.out){
          saldo += element.out;
          periodo.push(0);

          if(parcial == 0)
            parcial += element.time;

        }
        else if (element.input){
          saldo -= element.input;

          if(saldo == 0){
            total += element.time - parcial
            periodo.push(element.time - parcial)
            parcial = 0;
          }

        }

      })//exchange.forEach

      // Reune os score em uma array
      periodo.forEach((element, index) => {

        if(element > 0){
          percent.push(tempoScore(element));
        }
        else{
          percent.push(0);
        }
        // Soma o tempo armazenado
        score += tempoScore(element)
      })

      // Salva ou atualiza a reputação na carteira
      updateWallet(wallet,{
        $set: {
          'score.periodo' : periodo,
          'score.percent' : percent,
          'score.total'   : score
        }
      });

      // Resultados para visualização no console
      console.log('periodo', periodo);
      console.log('percent', percent);
      console.log('exchange', exchange);
      console.log('agora', agora);
      console.log('parcial', parcial);
      console.log('score', score );
      console.log('data atual', Math.round(agora), new Date(Date.now()).toDateString());
      console.log('Data inicio', tempoInicial, new Date(tempoInicial * 1000).toDateString());
      console.log('Data Final', tempoFinal, new Date(tempoFinal * 1000).toDateString());
      console.log('Tempo total de investimento(segundos)', tempoFinal - tempoInicial );
      console.log('Tempo investindo(segundos)', total);
      console.log('Tempo sem investir(segundos)', (tempoFinal - tempoInicial) - total );
      console.log('Porcentagem tempo de investimento', (total *100) / (tempoFinal - tempoInicial) );


  });//findWallet

} //scoreHolder

/* ---------------- Funções internas---------------- */


// Padroniza a busca para o modelo do banco
walletPattern = (rawaddr, owner) => {

  // Instancia o objeto wallet
  let wallet = conf.wallet(rawaddr.address, rawaddr.hash160, owner, rawaddr.total_received, rawaddr.total_sent, rawaddr.final_balance, rawaddr.n_tx)

  for(p_txs in rawaddr.txs){
    // Resume o valor adiquirido
    let r_txs = rawaddr.txs[p_txs];

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

  // Retornar o result
  return wallet;
}


// Retorna usuário pelo username
var findUser = (username, options, callback) => {

  let db1 = conf.db.base[1], //base - user
      coll1 = conf.db.coll[1], //coll - user
      query0 = {username: {$eq : username}};

  db.findOne(db1, coll1, query0, options,(err, doc) => {
    callback(err, doc);
  });
}


// Retorna usuário pelo ID
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


// Retorna uma carteira
var findWallet = (wallet, options, callback) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0], //coll - wallet
      query0 = {$or: [{_id: {$eq : wallet}}, {hash160: {$eq : wallet}}]};

  db.findOne(db1, coll1, query0, options,(err, doc) => {
    callback(err, doc);
  });
}

// Atualiza informações da carteira
var updateWallet = (wallet, update) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0], //coll - wallet
      query0 = {$or: [{_id: {$eq : wallet}}, {hash160: {$eq : wallet}}]};

  db.findOneAndUpdate(db1, coll1, query0, update, {});
}

// Deleta um document da collection pending
var deletePending = (wallet) => {

  let db0 = conf.db.base[0], //base - wallet
      db1 = conf.db.base[1], //base - user
      coll1 = conf.db.coll[1], //coll - user
      coll2 = conf.db.coll[2], //coll - pending
      query2 = {'wallet': {$eq: wallet}};

  db.findOneAndDelete(db0, coll2, query2);
  console.log('walletPending:'.blue, wallet ,'removido'.red);
}

// Deleta uma carteira inserida no documento do usuário
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
        console.log('deleteWalletUser:'.blue, wallet, 'não encontrado ou removido'.yellow );
      }
    }
    else{
      console.log('deleteWalletUser:'.blue, 'Usuário'.yellow, id, 'não encontrado'.yellow );
    }

  });
}


// Busca por novas transações para atualização das carteiras

// blocksExplorer = () => {
//
//   // // Valor teste de um bloco
//   let height = 538962;
//   // // Valor teste de um Hash
//   let hash;
//   // // Valor teste de uma wallet(carteira)
//   let wallet = '15L5wTYMfTjuZG6C1SCxRgXao5F8E2iX4u';
//
//   // // Armazenamento de valores obtidos no blockchain
//   let result = {
//     in : [],
//     out : []
//   }
//
//   // // Passo 01 Verificar todos os blocos e consultar o necessário
//   try {
//     // // Busca a hash e o height dos blocos
//     rest.req(coin.btc.getblocks())
//     .then( res => {
//       console.log('Extrato de Informações');
//
//       // // Busca e retorna o hash do bloco
//       for(blocks_pos in res.blocks){
//         // // if retorna apenas o Hash da variavel "height"
//         if(res.blocks[blocks_pos].height === height ){
//           console.log('height: ' ,res.blocks[blocks_pos].height);
//           console.log('hash: ',res.blocks[blocks_pos].hash);
//           hash = res.blocks[blocks_pos].hash;
//         }
//       }
//       // // Retorna o Valor da Hash para o proximo encadeamento
//       return hash;
//
//     }).then( res => {
//
//       // // Deve serguir os seguintes passos:
//       // // 1 - retornar com todas as carteiras do bloco
//       // // 2 - comparar se há alguma carteira cadastrada
//       // // 3 - realizar a atualização da carteira
//
//       // // Solicita o hash do bloco baseado no seu height
//       rest.req(coin.btc.rawblock(hash))
//       .then( res => {
//
//         // // Busca as transações no objeto "tx"
//         for(tx_pos in res.tx){
//           // // Armazena o objeto res.tx[pos array]
//           let tx = res.tx[tx_pos];
//
//           // // Titulo apenas para melhor orientação
//           // // console.log('Res.Tx:\t',tx_pos);
//
//           // // inputs da wallet
//           for(inputs_pos in tx.inputs){
//
//               // // Armazena o objeto res.tx[pos array].inputs[pos array]
//               let inputs = tx.inputs[inputs_pos];
//
//               if(typeof(inputs.prev_out) !== 'undefined'){
//               // // A primeira entrada é o premio do bloco e não ha input.
//               // // console.log('input ', inputs_pos, ':\t', inputs.prev_out.addr, '\tValue: ', inputs.prev_out.value*0.00000001);
//               result.in.push({addr: inputs.prev_out.addr, value: inputs.prev_out.value});
//             }
//           }
//
//           // // out da carteira
//           for(out_pos in tx.out){
//
//             // // Armazena o objeto res.tx[pos array].out[pos array]
//             let out = tx.out[out_pos];
//
//             if(typeof(out.addr) !== 'undefined'){
//               if(tx_pos == 0){
//                 // // Posição do premio do bloco e a carteira do minerador
//                 // // console.log('miner ',out_pos,':\t', out.addr, '\tValue: ', out.value*0.00000001);
//                 result.out.push({miner: out.addr, value: out.value});
//               }
//               else{
//                 // // console.log('out ',out_pos,':\t', out.addr,'\tValue: ', out.value*0.00000001);
//                 result.out.push({addr: out.addr, value: out.value});
//               }
//             }
//           }
//         }
//
//         // // Local para Retornar os valores armazenados
//         // console.log(result.in);
//         // console.log(result.out);
//         return result;
//
//       }).then( res => {
//         // // Verificar se os valores chegaram
//         console.log(res.in);
//         console.log(res.out);
//
//         // // Inserir os valores no banco de dados
//         // db.insert(res);
//
//       }).catch(err =>{
//         console.warn(err);
//       });
//
//     }).catch( err => {
//       console.warn('Erro na promisse rest.req em index.blocksExplorer\n', err);
//     });
//
//
//   } catch (err) {
//     console.log('Erro na função index.blocksExplorer\n', err);
//   }
//   // // Passo 2 consultar carteiras bloco para então criar ou atualizar
//
//   // // Passo 3 Consultar se existe alguma carteira cadastrada
//
//   // // Passo 3.1 Encontrando carteira, atualizar dados
//
//   // // Passo 4 - Recalcular reputação
//
//   // // Passo 5 Encerrar e consultar eta() para gerar delay
//
// }

/* ---------------- Inicializando asincrona funções ---------------- */

const startCore = async () => {
  // Execute como uma promisse ou callback

  // walletPending();
  scoreHolder('1EsFyxKWNHpzkfrxmbtBmEahPH43Lb2kub');
}


/* ---------------- Inicializando asincrona funções ---------------- */

startCore();
