var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var fs = require('fs');
var Parser = require('./Parser.js');
var Credenciado = require('./Credenciado.js');

obterCredenciados("RJ");

function obterCredenciados(estado) {
    var url = 'https://seguro2.petrobras.com.br/buscaams/busca.do';
    var formData = {
        estado: estado,
        cidade: "NITEROI",
        atendimento: 'true',
        method: 'buscar'
    }

    console.log("Consultando AMS");
    request.post({url: url, formData: formData}, function (err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }

        console.log("Realizando parser");
        var credenciados = parseCredenciados(body);
        fs.writeFile("credenciados.json", JSON.stringify(credenciados, null, 2));
    });
}

function parseCredenciados(body) {

    var $ = cheerio.load(body);
    var parser = new Parser($);

    var credenciados = [];
    var total = 0;
    var trs = $('tr');

    for (var i = 0; i < trs.length; i++) {

        var tr = $(trs[i]);

        if (parser.isData(tr)) {
            total++;
            let json = parser.toJSON(tr);
            let novoCredenciado = new Credenciado(json);

            let mesmoCredenciado = _.find(credenciados, function (credenciadoExistente) {
                return novoCredenciado.equals(credenciadoExistente);
            });

            if (mesmoCredenciado == null) {
                credenciados.push(novoCredenciado);
            } else {
                mesmoCredenciado.merge(novoCredenciado);
            }
        }
    }

    console.log("relatorio:");
    console.log("total linhas:  " + trs.length);
    console.log("total linhas com credenciados: " + total);
    console.log("total credenciados unicos: " + credenciados.length);

    return credenciados;
}



