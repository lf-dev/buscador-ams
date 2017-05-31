var http = require('http');

const cidades = [];


var build = function(query) {

}
exports.build = build;

var listarCidades = function() {

    const matchAllQuery = {
        "size": 10000,
        "query": {
            "match_all": {}
        }
    };

    consultarES("cidade", matchAllQuery, function(json) {
        var c = json.hits.hits.map(function(hit) {
            return hit._source.cidade;
        });

        while(cidades.length) {
            cidades.pop();
        }

        cidades.push(...c);

        console.log(cidades);
    })

}

var consultarES = function(index, jsonQuery, callback) {

    var options = {
        host: 'localhost',
        port: 9200,
        path: '/ams/'+index+'/_search',
        method: 'POST'
    };

    var req = http.request(options, function (res) {

        var body = [];
        res.on('data', function (chunk) {
            body.push(chunk);
        });
        res.on('end', function () {
            var bodyTxt = Buffer.concat(body).toString();
            var json = JSON.parse(bodyTxt);

            callback(json);
        });
    });

    req.write(JSON.stringify(jsonQuery));
    req.end();
}

listarCidades();