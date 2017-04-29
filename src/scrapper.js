var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var fs = require('fs');
var Parser = require('./Parser.js');
var Credenciado = require('./Credenciado.js');

//var estados = ["AL", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RS", "SC", "SE", "SP", "TO"];
var estados = ["DF","DF"];

//fetchOneByOne(estados, []);
fetchParallel(estados);

function fetchParallel(estados) {

    var promises = estados.map(function (estado) {
        return fetch(estado).then(function (body) {
            return parseCredenciados(body, estado);
        });
    });

    Promise.all(promises).then(function(credenciadosPorEstado) {
        reduceCredenciados(credenciadosPorEstado);
    });
}

function fetchOneByOne(estados, credenciadosPorEstado) {

    if(credenciadosPorEstado.length == estados.length){

        reduceCredenciados(credenciadosPorEstado);

    }else{

        var estado = estados[credenciadosPorEstado.length];

        fetch(estado).then(function(body) {

            return parseCredenciados(body, estado)

        }).then(function(novosCredenciados) {

            credenciadosPorEstado.push(novosCredenciados);

            fetchOneByOne(estados, credenciadosPorEstado);
        });
    }
}

function reduceCredenciados(credenciadosPorEstado){

    let todosCredenciados = _.flatten(credenciadosPorEstado);
    fs.writeFile("credenciados.json", JSON.stringify(todosCredenciados, null, 2));
}

function fetch(estado) {

    return new Promise(function(resolve, reject){

        var url = 'https://seguro2.petrobras.com.br/buscaams/busca.do';
        var formData = {
            estado: estado,
            atendimento: 'true',
            method: 'buscar'
        }

        console.log("Consultando " + estado);
        request.post({url: url, formData: formData}, function (err, httpResponse, body) {
            if (err) {
                reject(httpResponse);
            }else {
                resolve(body);
            }
        });
    });
}

function parseCredenciados(body, estado) {

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

    console.log(estado + " : " + credenciados.length + " credenciados");

    return credenciados;
}



