var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');
var Parser = require('./Parser.js');
var Credenciado = require('./Credenciado.js');

//var estados = ["AL", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RS", "SC", "SE", "SP", "TO"];
var estados = ["DF", "AL"];

//fetchSync(estados);
fetchAsync(estados);

function fetchAsync(estados) {

    var report = {};
    report["fetch_mode"] = "Async";
    report["start"] = new Date();

    var promises = estados.map(function (estado) {

        report[estado] = {};

        return fetch(estado, report[estado]).then(function (body) {
            return parseCredenciados(body, estado, report[estado]);
        });
    });

    Promise.all(promises).then(function(credenciadosPorEstado) {
        reduceCredenciados(credenciadosPorEstado, report);
        saveReport(report);
    });
}

function fetchSync(estados) {

    var report = {};
    report["fetch_mode"] = "Sync";
    report["start"] = new Date();
    _fetchSync(estados, [], report);

}

function _fetchSync(estados, credenciadosPorEstado, report) {

    if(credenciadosPorEstado.length == estados.length){

        reduceCredenciados(credenciadosPorEstado, report);
        saveReport(report);

    }else{

        var estado = estados[credenciadosPorEstado.length];
        report[estado] = {};

        fetch(estado, report[estado]).then(function(body) {

            return parseCredenciados(body, estado, report[estado]);

        }).then(function(novosCredenciados) {

            credenciadosPorEstado.push(novosCredenciados);

            _fetchSync(estados, credenciadosPorEstado, report);
        });
    }
}

function reduceCredenciados(credenciadosPorEstado, report){

    let todosCredenciados = _.flatten(credenciadosPorEstado);

    var stream = fs.createWriteStream("credenciados.json");
    stream.once('open', function(fd) {
        let id;
        for(id = 0; id < todosCredenciados.length; id++){

            stream.write('{"index":{"_id":"' + (id+1) + '"} }\n');
            stream.write('{"credenciado":' + JSON.stringify(todosCredenciados[id], null, 0) + '}\n');
        }
        stream.end();
    });

    report["total_credenciados"] = todosCredenciados.length;
}

function saveReport(report) {

    report["end"] = new Date();
    report["total_time"] = report["end"].getTime() - report["start"].getTime();

    var reportsDir = "./reports/"
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
    }

    var reportFile = moment(report["start"]).format() + ".json";
    var file = reportsDir + reportFile;

    fs.writeFile(file, JSON.stringify(report, null, 2), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("Relatorio de scrapper salvo!");
    });

}

function fetch(estado, report) {

    return new Promise(function(resolve, reject){

        var url = 'https://seguro2.petrobras.com.br/buscaams/busca.do';
        var formData = {
            estado: estado,
            atendimento: 'true',
            method: 'buscar'
        }

        console.log("Consultando " + estado);
        var start = new Date().getTime();
        request.post({url: url, formData: formData}, function (err, httpResponse, body) {
            if (err) {
                reject(httpResponse);
            }else {
                var end = new Date().getTime();
                console.log("Tempo consulta " + estado + ": " + (end-start) + " ms");
                report["fetch_time"] = (end-start);
                resolve(body);
            }
        });
    });
}

function parseCredenciados(body, estado, report) {

    var start = new Date().getTime();
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

    var end = new Date().getTime();
    report["parse_time"] = end - start;

    console.log(estado + " : " + credenciados.length + " credenciados");
    report["num_credenciados"] = credenciados.length;


    return credenciados;
}



