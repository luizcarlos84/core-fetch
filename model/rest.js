// Função de solicitação de JSON
req = (url) => {
  const fetch = require('node-fetch');

  return fetch(url)
  .then(res => res.json())
  .then(value =>{
    // console.warn(text); // debug- Para leitura
    return value;
  }).catch(err => {
    console.warn(err);
  });
}


// Função de buscas e analise dentro do JSON
extract = (res) => {
  if(arguments[1] === 'string')
    for(name in res){
      if( typeof(res[name]) === 'object' ){
        console.log('Entrado no Objeto: ' + name);
        extract(res[name]);
      }
      else {
        console.log( typeof(res[name]) + ': ' + namerest + ': ' + String(res[name]) );
      }
    }
}

module.exports.req = req;
module.exports.extract = extract;
