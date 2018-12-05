const conf = require('../conf/conf');

// Modelo padrão de variavel para o banco
wallet = (doc, owner) => {

  let address = doc.address,
      hash160 = doc.hash160,
      rec = doc.total_received,
      sent = doc.total_sent,
      bal = doc.final_balance,
      n_tx = doc.n_tx;

  // Instancia o objeto wallet
  let newWallet = conf.wallet(address, hash160, owner, rec, sent, bal, n_tx)


  for(p_txs in doc.txs){

    // Resume o valor adiquirido
    let r_txs = doc.txs[p_txs];


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
    newWallet.txs.push(txs);
  }

  // Retornar o result
  return newWallet;
}

module.exports.wallet = wallet;
