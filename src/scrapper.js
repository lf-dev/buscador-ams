var request = require('request');
var cheerio = require('cheerio');
var Parser = require('./Parser.js');

var url = 'https://seguro2.petrobras.com.br/buscaams/busca.do';
var formData = {
  estado: 'RJ',
  cidade: 'ANGRA DOS REIS',
  atendimento: 'true',
  method: 'buscar'
}

request.post({url:url, formData: formData}, function(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }

  var $ = cheerio.load(body);
  var parser = new Parser($);

  var total = 0;
  var trs = $('tr');
  for(var i=0; i<trs.length; i++){

    var tr = $(trs[i]);

    if(parser.isData(tr)){
      total++;
      console.log("---------------------");
      console.log(parser.toJSON(tr));
    }
  }
  console.log("total " + total);

  console.log(trs.length);
});
