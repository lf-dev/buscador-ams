var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('credenciados.json'),
    console: false
});

var stream = fs.createWriteStream("credenciados_es_batch.json");
var index = 1;

rd.on('line', function(line) {
    stream.write('{"index":{"_id":"' + (index+1) + '"} }\n');
    stream.write(line+"\n");
    index++;
});

rd.on('close', function() {

    stream.end();
});
