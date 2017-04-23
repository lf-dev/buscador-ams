var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var Parser = require('./Parser.js');
var Credenciado = require('./Credenciado.js');

var url = 'https://seguro2.petrobras.com.br/buscaams/busca.do';
var formData = {
    estado: 'RJ',
    cidade: 'ARMACAO DOS BUZIOS',
    atendimento: 'true',
    method: 'buscar'
}

request.post({url: url, formData: formData}, function (err, httpResponse, body) {
    if (err) {
        return console.error('upload failed:', err);
    }

    var $ = cheerio.load(body);
    var parser = new Parser($);

    var total = 0;
    var trs = $('tr');
    let credenciados = [];
    for (var i = 0; i < trs.length; i++) {

        var tr = $(trs[i]);

        if (parser.isData(tr)) {
            total++;
            let json = parser.toJSON(tr);
            let novoCredenciado = new Credenciado(json);

            let mesmoCredenciado = _.find(credenciados, function(credenciadoExistente) {
                return novoCredenciado.equals(credenciadoExistente);
            });

            if(mesmoCredenciado == null){
                credenciados.push(novoCredenciado);
            }else {
                mesmoCredenciado.merge(novoCredenciado);
            }
        }
    }

    console.log(JSON.stringify(credenciados, null, 2));

    console.log("total linhas:  " + trs.length);
    console.log("total linhas com credenciados: " + total);
    console.log("total credenciados unicos: " + credenciados.length);

});
