const colors = require('colors');

const db = require('../db/db');
const query = require('../db/query.js');
const conf = require('../conf/conf');



/* scoreWallet = Calcula com um valor entre 0 e 100 sobre o tipo de investidor
   baseado no TEMPO que ele retem uma quantia.
*/

var wallet = () => {
  let exchange = []        //filtra e armazena as transações da busca em objetos,
      agora = Math.round(Date.now()/1000), //tempo exato das transações (epoch)
      saldo = 0,           // Armazena um saldo quando depositado
      periodoInicial = 0,  // Periodo inicial de transação
      periodoFinal = 0,    // Período final de transação
      periodoMedio = 0,    // Soma dos periodos
      tempoInicial = 0,    // Tempo inicial de análise (epoch)
      tempoFinal = 0,      // Tempo final de análise (epoch)
      tempoTotal = 0,      // SOMA de todos os periodos encontrado
      tempoMedio = 0,      // Periodo de tempo inicial e final
      periodo = [],        // RESULTADO: armazena o período de cada transação normalmente o out é zero
      percent = [],        // RESULTADO: armazena a percentagem a ser somada.
      score = 0,           // RESULTADO: o valor do Score
      filter = '';


  let orderScore = (err, doc) => {

    // Organiza as transações dentro da array exchange
    doc.txs.forEach( element => {

      element.inputs.forEach( element1 => {

        if(element1.addr == doc._id)
          exchange.push({
            'time':element.time,
            'input':element1.value
          });

      });

      element.out.forEach( element1 => {

        if(element1.addr == doc._id)
          exchange.push({
            'time':element.time,
            'out':element1.value
          });

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

    // Executa o compare e reordena a array
    exchange.sort(compare);

    timeScore(doc);

  }

  let timeScore = (doc) => {

    // Tempo Mínimo: 180 dias (epoch)
    let tempoMinimo = agora - 15552000;

    // Periodo Incial de transação
    periodoInicial = Math.min.apply(Math, exchange.map( x => {return x.time}));


    // Tempo Inicial de analise
    if(periodoInicial > tempoMinimo)
      tempoInicial = tempoMinimo;
    else
      tempoInicial = periodoInicial;

    /* Para aumentar a precisão do tempo é necessário descobrir se a carteira
       possui saldo. Se sim então o período é contado até a data atual.
    */

    let fundos = exchange.map( obj => {
      if(obj.out)
        return obj.out;
      if(obj.input)
        return (-1 * obj.input);
    }).reduce((valorTotal, element ) => {
      return valorTotal + element;
    })


    // Periodo Final de transação
    if(fundos)
      periodoFinal = agora;
    else
      periodoFinal = Math.max.apply(Math, exchange.map( x => {return x.time}));


    // Tempo Final de análise
    tempoFinal = agora;

    // Média de tempo
    tempoMedio = tempoFinal - tempoInicial;

    // Media de periodo
    periodoMedio = periodoFinal - periodoInicial;

    wipeScore(doc);
  }

  /* É necessário limpar a array de score antes de inserir novas pontuações */
  let wipeScore = (doc) => {

    if(doc.score.exchange){
      let filter = doc.score.exchange.map(element => {

        if(element.out)
          return {
            "time": element.time,
            "out": element.out,
            "periodo": element.periodo,
            "percent": element.percent
          };

        else
          return {
            "time": element.time,
            "input": element.input,
            "periodo": element.periodo,
            "percent": element.percent
          };

      });

      if(doc.score.exchange){

        query.updateWallet(doc._id,{$pullAll: {
          "score.exchange": filter

        }});
      }
    }

    calcScore(doc);
  }


  let calcScore = (doc) => {


    /* Calcula e insere o tempo de investimento na array periodo */
    let calcPeriodo = (element, index) => {

      // Primeiro elemento da array
      if(index == 0){

        // normalmente a carteira inicia com uma entrada
        if(element.out){
          saldo += element.out;
          parcial = element.time;


          return 0;
        }

      }
      // Último elemento da array
      else if( index == (exchange.length - 1)){

        if(element.out){

          saldo += element.out;


          return (tempoFinal - parcial);

        }

        if(element.input){

          saldo -= element.input;


          if(saldo > 0)
            return (tempoFinal - parcial);

          else
            return (element.time - parcial);

        }

      }
      else {


        if(element.out){

          if(saldo == 0)
            parcial = element.time;

          saldo += element.out;


          return 0;

        }

        if(element.input){

          saldo -= element.input;


          if(saldo > 0)
            return 0;

          else
            return (element.time - parcial);

        }

      }

    }//calcPeriodo

    // variavel para a função calcPeriodo
    let parcial;

    // Zerando o saldo antes da execução da função calcPeriodo
    saldo = 0;

    // Calcula o periodo e armazena em periodo
    periodo = exchange.map( calcPeriodo );


    // Soma os periodos e armazena em tempoTotal
    tempoTotal = periodo.reduce( (soma, x) => {
      return soma + x;
    });


    // Insere o resultado como um objeto a ser armazenado no banco
    exchange.forEach( (element, index) => {

      // As variaveis exchange e periodo precisam possuir o mesmo tamanho
      if(exchange.length == periodo.length){

        Object.assign( element , { periodo: periodo[index] })
      }
    })


    percentScore( doc );
  }


  let percentScore = (doc) => {

    /* calcPercent = Realiza o um calculo entre cada periodo de debito e credito
       e retorna um score baseado no tempo inicial e final.
       calcPercent tem atributo LET para existir apenas na função scoreWallet */
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

      if(element)
        return calcPercent(element);
      else
        return 0;

    }


    // armazena as percentagem em array
    percent = periodo.map( sortPercent )


    // armazena a soma em uma variavel
    score = percent.reduce( (soma, x) => {
      return soma + x
    });


    exchange.forEach( (element, index) => {

      // as variaveis exchange e periodo possuem o mesmo tamanho
      if(exchange.length == percent.length){

        Object.assign( element , {percent: percent[index]})
      }
    })

    saveScore(doc);
  }


  // Salva ou atualiza a reputação na carteira
  let saveScore = (doc) => {

    // variavel temporária para salvar bo banco
    let temp = [];


    /* Para armazenar no banco é necessário que o nome do variavel
       seja uma string. Então toda a função é necessária que seja
       rescrita.
       obs: analisar o uso do stringify()
    */

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
          "input"  : element.input,
          "periodo": element.periodo,
          "percent": element.percent
        })
      }
    })


    // Update
    query.updateWallet(doc._id,{
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
      console.log('exchange\n'.green, exchange);
      console.log('agora\t\t'.green, agora);
      console.log('Tempo Inicial\t'.blue, tempoInicial, new Date(tempoInicial * 1000).toString() );
      console.log('Periodo Inicial\t'.blue, periodoInicial, new Date(periodoInicial * 1000).toString() );
      console.log('Periodo Final\t'.red, periodoFinal, new Date(periodoFinal * 1000).toString() );
      console.log('Tempo Final\t'.red, tempoFinal, new Date(tempoFinal * 1000).toString() );
      console.log('Tempo Medio\t'.blue, tempoMedio);
      console.log('Periodo Medio\t'.blue, periodoMedio);
      console.log('Tempo holder\t'.green, periodo.reduce((sum, x) => {return sum + x}) );
      console.log('Tempo fora\t'.green, periodoMedio - periodo.reduce((sum, x) => {return sum + x}) );
      console.log('Porcentagem \t'.green, percent.reduce((sum, x) => {return sum + x}) );
      console.log('score\t\t'.green, score.toFixed(2));

      clearVar();
  } //resultScore


  let clearVar = () => {

    exchange.splice(0);  //filtra e armazena as transações da busca em objetos,
    agora = Math.round(Date.now()/1000);           //tempo exato das transações (epoch)
    saldo = 0;           // Armazena um saldo quando depositado
    periodoInicial = 0,  // Periodo inicial de trnsação
    periodoFinal = 0,    // Período final de transação
    periodoMedio = 0,    // Soma dos periodos
    tempoInicial = 0,    // Tempo inicial de análise (epoch)
    tempoFinal = 0,      // Tempo final de análise (epoch)
    tempoTotal = 0,      // SOMA de todos os periodos encontrado
    tempoMedio = 0,      // Periodo de tempo inicial e final
    periodo.splice(0);   // RESULTADO: armazena o período de cada transação normalmente o out é zero
    percent.splice(0);   // RESULTADO: armazena a percentagem a ser somada.
    score = 0;           // RESULTADO: o valor do Score
    filter = '';
  }

  // Query de consulta e filtro de resultado
  let q = {},
      options = { projection: {
        '_id'  : 1,
        'owner': 1,
        'score': 1,
        'n_tx' : 1,
        'txs'  : 1}};


  query.findWalletInScore(q, options, (err, array) => {

    if(array.length > 0)
      array.forEach( (doc, index) => {

        /* O Objetivo é que cada valor na array tenha um espaço de tempo
        para a execução. Então cada elemento tera um espaço de 5 segundos*/
        setTimeout(() => {orderScore(err, doc)}, 5000 * index)

      }); //array.forEach
    else {
      console.log('score.wallet:'.blue, 'Sem carteiras para atualização');
    }

  });//findWalletToArray

} //score.wallet


module.exports.wallet = wallet;
