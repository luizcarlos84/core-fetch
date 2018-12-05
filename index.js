/* ---------------- Required ---------------- */
const score = require('./module/score');
const pending = require('./module/pending');
const update = require('./module/update');

/* ----------------------- Looping das funções ---------------------- */

// Execute as funções e realiza um atraso de acordo com o tempo inserido
const delay = ( func, seg ) => {
  setInterval(func, seg * 1000);
}


// Execução das funções
const startCore = () => {

  // Busca por uma wallet pendente de registro
  pending.wallet();

  // update.wallet();
  // Atualiza

  // Calcula
  // score.wallet();

  delay(startCore, 40);
}


/* ---------------- Inicializando asincrona funções ---------------- */

startCore();
