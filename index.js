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




/* ---------------- Funções internas---------------- */





/* Padroniza as informações  a ser armazenados no banco de dados.*/

walletPattern = (raw, owner) => {

  let address = raw.address,
      hash160 = raw.hash160,
      rec = raw.total_received,
      sent = raw.total_sent,
      bal = raw.final_balance,
      n_tx = raw.n_tx;

  // Instancia o objeto wallet
  let wallet = conf.wallet(address, hash160, owner, rec, sent, bal, n_tx)

  for(p_txs in raw.txs){
    // Resume o valor adiquirido
    let r_txs = raw.txs[p_txs];

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





/* Retorna usuário pelo username */

var findUser = (username, options, callback) => {

  let db1 = conf.db.base[1], //base - user
      coll1 = conf.db.coll[1], //coll - user
      query0 = {username: {$eq : username}};

  db.findOne(db1, coll1, query0, options,(err, doc) => {
    callback(err, doc);
  });
}





/* Retorna usuário pelo ID */

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





/* Retorna uma carteira */

var findWallet = (wallet, options, callback) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0], //coll - wallet
      query0 = {$or: [{_id: {$eq : wallet}}, {hash160: {$eq : wallet}}]};

  db.findOne(db1, coll1, query0, options,(err, doc) => {
    callback(err, doc);
  });
}





/* Retorna uma array carteira */

var findWalletToArray = (query, options, callback) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0]; //coll - wallet

  db.findToArray(db1, coll1, query, options,(err, doc) => {
    callback(err, doc);
  });
}


/* Atualiza informações da carteira */

var updateWallet = (wallet, update) => {

  let db1 = conf.db.base[0], //base - wallet
      coll1 = conf.db.coll[0], //coll - wallet
      query0 = {$or: [{_id: {$eq : wallet}}, {hash160: {$eq : wallet}}]};

  db.findOneAndUpdate(db1, coll1, query0, update, {upsert: true});
}




/* Deleta um document da collection pending */

var deletePending = (id, wallet) => {

  let db0 = conf.db.base[0], //base - wallet
      db1 = conf.db.base[1], //base - user
      coll1 = conf.db.coll[1], //coll - user
      coll2 = conf.db.coll[2], //coll - pending
      query2 = {$and : [{'_idUser': {$eq: id}}, {'wallet': {$eq: wallet}}]};

  db.findOneAndDelete(db0, coll2, query2);
  console.log('deletePending:'.blue, wallet ,'removido de wallet.pending'.red);
}



/* Deleta uma carteira inserida no documento do usuário */

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

/* ---------------- Funções em desenvolvimento ---------------- */





/* Busca por novas transações para atualização das carteiras */

/*
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
*/

/* ---------------- Funções externas ---------------- */





/* Verificar carteiras inseridas pelo usuário. */
var walletPending = () => {

  let db0 = conf.db.base[0], //base - wallet
      coll0 = conf.db.coll[0], //coll - wallet
      query0 = {},
      options0 = {},
      coll2 = conf.db.coll[2], //coll - pending
      query2 = {},
      options2 = {};

  let checkPending = (err, doc) => {

    query0 = {$or: [{'_id': {$eq : doc.wallet}}, {'hash160': {$eq : doc.wallet}}]}
    findWallet(doc.wallet, {}, (err, doc1) => {

      // Se a wallet existe
      if(doc1){

        // Se houver proprietario
        if (doc1.owner){

          // Se o solicitante for o proprietario
          if(doc._idUser.equals(doc1.owner)) {
            // Verifica se possui dono
            console.log('walletPending:'.blue, doc1._id,'é de sua propriedade'.yellow);
          }
          else{
            // Verifica se possui dono
            console.log('walletPending:'.blue, doc1._id, 'possui outro proprietario'.yellow);

            deleteWalletUser( doc._idUser, doc.wallet )

          }

          // Remove um documento em wallet.pending
          deletePending( doc._idUser, doc.wallet );
        }
        else{
          // Insere o ID do solicitante
          db.findOneAndUpdate(db0, coll0, query0, { $set: { 'owner': doc._idUser} }, {});
          console.log('walletPending:'.blue, 'Proprietário inserido');

          // Remove do Pending
          deletePending( doc._idUser, doc.wallet );

        }
      }
      else {
        // Insere uma nova
        coin.btc.rawaddr( doc.wallet )
        .then( res => {
          query0 = walletPattern( res, doc._idUser );
          db.insertOne(db0, coll0, query0);

          // Remove do Pending
          deletePending( doc._idUser, doc.wallet );

        })
        console.log('walletPending:'.blue, 'Carteira Inserida');
      }
    })
  }//checkPending

  /* Realiza busca em wallet.pendig para encontrar carteiras solicitadas */

  db.findToArray(db0, coll2, query2, options2, (err, array) => {

    if(array.length > 0){

      array.forEach( (element, index) => {

        /* O Objetivo é que cada valor na array tenha um espaço de tempo
        para a execução. Então cada elemento tera um espaço de 10 segundos*/
        if(element)
          // setTimeout(() => {checkPending(err, element)}, 10000 * index)
          checkPending(err, element);
        else {
          console.log('walletPending:'.blue, 'Elemento vazio'.red);
        }
      }); //doc.for each
    } //if(array.length > 0)

    else{
      console.log('walletPending:'.blue, 'Sem Carteiras em pending'.yellow);
    }

  }); //db.findToArray
}


/* scoreHolder = Calcula com um valor entre 0 e 100 sobre o tipo de investidor
   baseado no TEMPO que ele retem uma quantia.
   * 0 ate 20 "conservador", até 60 "moderado" 50 a 100 "holder - Agressivo"
   * informar Data de inicio do investimento
*/

scoreHolder = () => {
  let exchange = [] //filtra e armazena as transações da busca em objetos,
      total = 0, // tempo de investimento somado todos os periodos
      saldo = 0, //armazena um saldo quando depositado
      agora = Math.round(Date.now()/1000), //tempo exato das transações (epoch)
      tempoInicial = 0, //Data primeira transação (epoch)
      tempoFinal = 0, //Data Ultima transação (epoch)
      tempoMedio = 0,  // Periodo de tempo inicial e final
      periodo = [], // RESULTADO: armazena o período de cada transação normalmente o out é zero
      percent = [], // RESULTADO: armazena a percentagem a ser somada.
      score = 0; //RESULTADO: o valor do Score


  let orderScore = (err, doc) => {

    if(doc.score.exchange){
      updateWallet(doc._id,{$pullAll: {
        "score.exchange": doc.score.exchange
      }});
    }


    // Organiza as transações dentro da array exchange
    doc.txs.forEach( element => {

      element.inputs.forEach( element1 => {

        if(element1.addr == doc._id)
          exchange.push({'time':element.time, 'input':element1.value});

      });

      element.out.forEach( element1 => {

        if(element1.addr == doc._id)
          exchange.push({'time':element.time, 'out':element1.value});

      });

    });



    // Colocar na ordem do mais antigo ao mais recente
    let compare = (a, b) => {
      if( a.time < b.time )
        return -1;
      if( a.time > b.time )
        return 1;
      return 0;
    }

    // Executa o compare
    exchange.sort(compare);

    // As arrays com os objetos usam map para criar uma array de variavel time
    if(exchange[exchange.length - 1].out)
      tempoFinal = agora;
    else
      tempoFinal = Math.max.apply(Math, exchange.map( x => {return x.time}));

    tempoInicial = Math.min.apply(Math, exchange.map( x => {return x.time}));
    tempoMedio = agora - tempoInicial;


    calcScore(doc);
  }


  let calcScore = (doc) => {


    /* Calcula e insere o tempo de investimento na array periodo */
    let calcPeriodo = (element, index) => {
      if(index == 0){

        // normalmente a carteira inicia com uma entrada
        if(element.out){
          saldo += element.out;
          parcial = tempoInicial;

          return 0;
        }

      }
      else if( index < (exchange.length - 1)){


        if(element.out){

          if(saldo > 0){
            saldo += element.out;

            return 0;
          }
          else{
            parcial = element.time;
            saldo += element.out;

            return 0;
          }

        }

        if(element.input){

          saldo -= element.input;

          if(saldo > 0){

            return 0;
          }
          else{

            return (element.time - parcial);
          }

        }


      }
      else {

        if(element.out){

          saldo += element.out;

          return (tempoFinal - element.time);

        }

        if(element.input){

          saldo -= element.input;

          if(saldo > 0){

            return 0;
          }
          else{

            return (element.time - parcial);
          }

        }

      }

    }//calcPeriodo
    let parcial;
    periodo = exchange.map( calcPeriodo );

    let reducer = (total, soma) => {
      return total + soma
    }

    // Soma os periodos e armazena em total
    total = periodo.reduce( reducer );

    //
    exchange.forEach( (element, index) => {

      // as variaveis exchange e periodo possuem o mesmo tamanho
      if(exchange.length == periodo.length){

        Object.assign( element , {periodo: periodo[index]})
      }
    })


    percentScore( doc );
  }


  let percentScore = (doc) => {

    /* calcPercent = Realiza o um calculo entre cada periodo de debito e credito
       e retorna um score baseado no tempo inicial e final.
       calcPercent tem atributo LET para existir apenas na função scoreHolder */
    let calcPercent = ( tempoParcial ) => {



      // Transaforma em percentagem
      let x = (tempoParcial * 100) / tempoMedio;



      /* Utiliza uma função de desvio padrão. pode ser usado funções matermaticas
       para dar maior pontuação a transações mais recentes.
       A variação abaixo é uma função de 1º grau com retorno entre 0,66 a 1,66*/
      let y = ( (3 * x) + 200 ) / 300;


      // return (x * y)
      return ( x );
    }

    // Calcula o score e armazena na array percent
    let sortPercent = (element, index) => {
      // console.log('calcPercent', element, index);
      let x = calcPercent(element)

      if(element > 0){
        return x;
      }
      else{
        return 0;
      }
    }

    // armazena as percentagem em array
    percent = periodo.map( sortPercent )

    // realiza a soma dos valores em uma array
    let reducer = (total, soma) => {
      return total + soma
    }

    // armazena a soma em uma variavel
    score = percent.reduce( reducer );


    exchange.forEach( (element, index) => {

      // as variaveis exchange e periodo possuem o mesmo tamanho
      if(exchange.length == percent.length){

        Object.assign( element , {percent: percent[index]})
      }
    })


    saveScore(doc);
  }


  let saveScore = (doc) => {
    // Salva ou atualiza a reputação na carteira

    let temp = [];

    exchange.forEach((element, index) => {
      if(element.out)
        temp.push({
          "time"   : element.time,
          "out"    : element.out,
          "periodo": element.periodo,
          "percent": element.percent
        })
      else {
        temp.push({
          "time"   : element.time,
          "input"    : element.input,
          "periodo": element.periodo,
          "percent": element.percent
        })
      }
    })

    // updateWallet(doc._id,{
    //   $pull: {
    //     'score.exchange': { $gte: 0 }
    //   }
    // });

    updateWallet(doc._id,{
      $set: {
        'score.timestamp': Date.now(),
        'score.score' : score
      },
      $push: {
        'score.exchange': {
          $each: temp,
          $sort: {time: -1}
        }
      }
    });


    resultScore();
  }


  let resultScore = () => {

      // Resultados para visualização no console
      console.log('exchange\n', exchange);
      console.log('agora', agora);
      console.log('score', score );
      console.log('data atual', Math.round(agora), new Date(Date.now()).toDateString());
      console.log('Data inicio', tempoInicial, new Date(tempoInicial * 1000).toDateString());
      console.log('Data Final', tempoFinal, new Date(tempoFinal * 1000).toDateString());
      console.log('Tempo total de investimento(segundos)', tempoMedio );
      console.log('Tempo investindo(segundos)', total);
      console.log('Tempo sem investir(segundos)', tempoMedio - total );
      console.log('Porcentagem tempo de investimento', (total *100) / tempoMedio );
      console.log('score', score.toFixed(2));

      clearScore();
  } //resultScore


  let clearScore = () => {

    exchange.splice(0); //filtra e armazena as transações da busca em objetos,
    total = 0; // tempo de investimento somado todos os periodos
    saldo = 0; //armazena um saldo quando depositado
    agora = Math.round(Date.now()/1000); //tempo exato das transações (epoch)
    tempoInicial = 0; //Data primeira transação (epoch)
    tempoFinal = 0; //Data Ultima transação (epoch)
    tempoMedio = 0;  // Periodo de tempo inicial e final
    periodo.splice(0); // RESULTADO: armazena o período de cada transação normalmente o out é zero
    percent.splice(0); // RESULTADO: armazena a percentagem a ser somada.
    score = 0;
  }

  //Subrair em milisegundos (segundo * 1000)
  let cronos = Date.now() - 90000;
  // Variaveis para o banco

  let query = {},
      options = { projection: {
        '_id'  : 1,
        'owner': 1,
        'score': 1,
        'n_tx' : 1,
        'txs'  : 1}};


  findWalletToArray(query, options, (err, array) => {

    if(array.length > 0)
      array.forEach( (doc, index) => {

        /* O Objetivo é que cada valor na array tenha um espaço de tempo
        para a execução. Então cada elemento tera um espaço de 5 segundos*/
        setTimeout(() => {orderScore(err, doc)}, 5000 * index)

      }); //array.forEach
    else {
      console.log('scoreHolder:'.blue, 'Sem carteiras para atualização');
    }

  });//findWallet

} //scoreHolder




/* ----------------------- Looping das funções ---------------------- */


const startCore = async () => {

  // Busca por uma wallet pendente de registro
  walletPending();

  // Calcula
  setTimeout(() => {scoreHolder()}, 5000);

  // Execute a função com determinado perido de tempo em ms
  setInterval(startCore, 40 * 1000);
}


/* ---------------- Inicializando asincrona funções ---------------- */

startCore();
