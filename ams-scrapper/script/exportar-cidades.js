var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('credenciados.json'),
    console: false
});

var cidades = [];

rd.on('line', function(line) {

    let json = JSON.parse(line);

    json.credenciado.enderecos.forEach(function(e) {

        if(cidades.indexOf(e.cidade) == -1){
            cidades.push(e.cidade);
        }
    });
});

var stream = fs.createWriteStream("cidades.json");
var index = 1;

rd.on('close', function() {

    cidades.forEach(function(cidade) {
        stream.write('{"index":{"_id":"' + (index) + '"} }\n');
        stream.write(JSON.stringify(cidade)+'\n');
        index++;
    });

    stream.end();
});


