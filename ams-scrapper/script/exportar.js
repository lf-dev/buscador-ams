var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('credenciados.json'),
    console: false
});

var handlers = [new CidadeHandler(), new EstadoHandler(), new EspecialidadeHandler()];

rd.on('line', function(line) {

    var json = JSON.parse(line);

    handlers.forEach(function(handler) {
        handler.export(line, json);
    });
});

rd.on('close', function() {

    handlers.forEach(function(handler) {

        var stream = fs.createWriteStream(handler.filename);

        var index = 1;
        handler.elements.forEach(function(element) {
            stream.write('{"index":{"_id":"' + (index) + '"} }\n');
            stream.write(JSON.stringify(element)+'\n');
            index++;
        });
        stream.end();
    });

});


function CidadeHandler() {
    this.elements = new Set();
    this.filename = "cidades_es_batch.json";

    this.export = function(line, json){
        var self = this;
        json.credenciado.enderecos.forEach(function(e) {
            self.elements.add(e.cidade);
        });
    }
}

function EstadoHandler() {
    this.elements = new Set();
    this.filename = "estados_es_batch.json";

    this.export = function(line, json){
        var self = this;
        json.credenciado.enderecos.forEach(function(e) {
            self.elements.add(e.estado);
        });
    }
}

function EspecialidadeHandler() {
    this.elements = new Set();
    this.filename = "especialidades_es_batch.json";

    this.export = function(line, json){
        var self = this;
        json.credenciado.enderecos.forEach(function(endereco) {

            endereco.especialidades.forEach(function(especialidade) {
                self.elements.add(especialidade);
            });
        });
    }
}