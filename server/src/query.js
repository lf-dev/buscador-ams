var http = require('http');

const cidades = [];

var build = function(query) {

}
exports.build = build;

var listarCidades = function() {

    var formData =
    {
        "size": 10000,
        "query": {
            "match_all": {}
        }
    };

    var options = {
        host: 'localhost',
        port: 9200,
        path: '/ams/cidade/_search',
        method: 'POST'
    };

    var esReq = http.request(options, function (res) {

        var body = [];
        res.on('data', function (chunk) {
            body.push(chunk);
        });
        res.on('end', function () {
            var bodyTxt = Buffer.concat(body).toString();

            var json = JSON.parse(bodyTxt);

            var c = json.hits.hits.map(function(hit) {
                return hit._source.cidade;
            });

            while(cidades.length) {
                cidades.pop();
            }

            cidades.push(...c);

            console.log(cidades);

        });
    });

    esReq.write(JSON.stringify(formData));
    esReq.end();
}

listarCidades();