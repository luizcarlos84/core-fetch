// Required - exports
const dotenv = require('dotenv').load();

// Required - customs exports
const conf = require('./conf/conf');
const coin = require('./model/coin');
const rest = require('./model/rest');
const time = require('./model/timeStamp');
const db = require('./repo/db');

// Variables
var wallet = process.env.WALLET;
var hash = process.env.HASH

// Views
async function view(){
  try{

    // Verificando retorno das function
    console.log('Informações das funções');
    console.log(wallet);
    console.log(coin.btc.latestblock());
    console.log(coin.btc.rawtx(hash));
    console.log(coin.btc.rawblock());
    console.log(coin.btc.rawaddr(wallet));
    console.log(coin.btc.balance(wallet));

    // Teste com base de dados
    base = db.connect()
    db.search(base);
    // db.insert();

    // retorno de valores
    // console.log(db.conf);
    // console.log(db.btc_conf);

    // // Função assincrona
    // rest.req(coin.btc.rawtx(hash))
    // .then( res => {
    //   console.log('Extrato de Informações');
    //   console.log(time.timeConverter(1533585112));
    //
    //   // Inicializando a busca
    //   // console.log(res);
    //   // rest.extract(res);
    // }).catch( err => {
    //   console.warn('Erro: ', err);
    // });
    // console.log(coin.btc.txfee('af8d5f554f58adb3a04a8f8514f83623ed21a5a1241034fdbaa540df110c2106'));
    // rest.req(coin.btc.txfee('af8d5f554f58adb3a04a8f8514f83623ed21a5a1241034fdbaa540df110c2106'))
    // .then( res =>{
    //   console.log(res);
    // })
    // .catch( err =>{
    //   console.log('Erro : ', err);
    // })

  }
  catch(err){
    console.log('Erro no Codigo: ');
    console.log(err);
  }
}




// Inicializando as function
view();
