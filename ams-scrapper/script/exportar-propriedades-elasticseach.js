var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('credenciados.json'),
    console: false
});

var handlers = [    new Handler("estados_es_batch.json", "credenciado.enderecos.estado"),
                    new Handler("cidades_es_batch.json", "credenciado.enderecos.cidade"),
                    new Handler("bairros_es_batch.json", "credenciado.enderecos.bairro"),
                    new Handler("especialidades_es_batch.json", "credenciado.enderecos.especialidades")];

rd.on('line', function(line) {

    var json = JSON.parse(line);

    handlers.forEach(function(handler) {
        handler.collectUniques(json);
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

function Handler(filename, path) {

    this.elements = new Set();
    this.filename = filename;
    this.path = path;
}

Handler.prototype.collectUniques = function(json) {
    this._collectUniques(json, this.path.split('.'), this);
}

Handler.prototype._collectUniques = function(currentNode, path, self){

    //Objectos nao arrays serao tratados como um array de um unico objeto
    ([].concat(currentNode)).forEach(function(element) {

        if(path.length == 0) {
            self.elements.add(element);
        }else {
            var key = path[0];
            self._collectUniques(element[key], path.slice(1), self);
        }
    });
}
