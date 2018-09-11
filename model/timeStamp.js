timeStamp = () => {

  let date = new Date();
  let time = 0;

  if (date.getHours() < 10)
    time = '0' + date.getHours();
  else
    time = date.getHours();

  if (date.getMinutes() < 10)
    time += ':0' + date.getMinutes();
  else
    time += ':' + date.getMinutes();

  if (date.getSeconds() < 10)
    time += ':0' + date.getSeconds();
  else
    time += ':' + date.getSeconds();

    return time;
}

timeConverter = (UNIX_timestamp) => {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

module.exports.timeStamp = timeStamp;
module.exports.timeConverter = timeConverter;
