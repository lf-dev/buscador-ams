/*
Lista todas as especialidades encontradas no arquivo de credenciados.json
Verifica se as especialidades listadas ja existem no dicionario de especialidades (resources/especialidades_unicas.json)
Escreve um arquivo (especialidades_unicas_template.json) com as especialidades que não existem no dicionario
 */

var fs = require('fs'),
    readline = require('readline');

var especialidadesExistentes = JSON.parse(fs.readFileSync('resources/especialidades_unicas.json'));
var especialidades = [];

var rd = readline.createInterface({
    input: fs.createReadStream('credenciados.json'),
    console: false
});

rd.on('line', function(line) {

    let json = JSON.parse(line);
    if(json.index){
        return;
    }

    json.credenciado.enderecos.forEach(function(e) {

        e.especialidades.forEach(function(esp) {

            if(!especialidadesExistentes[esp] && especialidades.indexOf(esp) == -1) {
                especialidades.push(esp);
            }
        });
    });


});

rd.on('close', function() {

    var especialidadesJson = {};
    especialidades.forEach(function(esp) {
        especialidadesJson[esp] = "";
    });

    fs.writeFile("especialidades_unicas_template.json", JSON.stringify(especialidadesJson, null, 2));
});

