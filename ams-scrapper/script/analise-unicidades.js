/**
 * Imprime os credenciados que possuam o mesmo valor de id ( no campo de id ou em qualquer outro campo)
 * O objetivo eh verificar se faz sentido aumentar o peso da propriedade de id na busca
 */

var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('credenciados.json'),
    console: false
});

var credenciados = [];

rd.on('line', function(line) {

    var credenciado = JSON.parse(line);
    credenciados.push(credenciado);
});

rd.on('close', function() {

    var strs = credenciados.map(function(c) {
        return JSON.stringify(c);
    });

    console.log(credenciados.length);

    credenciados.forEach(function(credenciado1, index1) {

        credenciados.forEach(function(credenciado2, index2){

            var str1 = strs[index1];
            var str2 = strs[index2];

            if(str1 != str2) {

                if(credenciado1.pessoa.id && credenciado1.pessoa.id.trim().length > 0 && str2.indexOf(credenciado1.pessoa.id) > -1){

                    console.log(credenciado1.pessoa.nome + " => " + credenciado2.pessoa.nome + " => " + credenciado1.pessoa.id);
                }
            }
        });
    });
});
