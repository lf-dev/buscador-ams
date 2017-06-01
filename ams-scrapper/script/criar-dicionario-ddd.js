var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('resources/dicionario_ddds.in'),
    console: false
});

var ddds = {};
var estado;
var possuiNumero = /[\d]+/;

rd.on('line', function(line) {

    if(line.startsWith('#')){
        return;
    }
    if(possuiNumero.test(line)){

        var codigo = possuiNumero.exec(line)[0];
        var cidade = line.replace(codigo,'').trim();
        estado.cidades[cidade] = codigo;

    }else if(line.trim().length > 0){

        var sigla = line.substr(0,2);
        estado = {};
        estado.cidades = {};
        ddds[sigla] = estado;
    }

});

rd.on('close', function() {
    fs.writeFile("resources/dicionario_ddds.json", JSON.stringify(ddds, null, 2));
});
