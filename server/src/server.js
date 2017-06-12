var http = require('http');
var url = require('url');
var router = require('./router');

var app = router(3000);

app.get('/search', function (req, res) {

    var pageSize = 10;
    var q = url.parse(req.url, true);

    var query = {
        "from": q.query.from*pageSize,
        "size": pageSize,
        "query": {
            "bool": {
                "should": [
                    {
                        "multi_match": {
                            "query": q.query.q,
                            "fields": [
                                "pessoa.id^4",
                                "enderecos.telefones^4",
                                "pessoa.nome^3",
                                "enderecos.cidade^2",
                                "_all" ],
                            "type": "cross_fields"
                        }
                    },
                    {
                        "match": {
                            "enderecos.especialidades": {
                                "query": q.query.q,
                                "fuzziness": "AUTO"
                            }
                        }
                    }
                ]
            }
        }
    };


    var options = {
        host: 'localhost',
        port: 9200,
        path: '/ams/credenciado/_search',
        method: 'POST'
    };

    var esReq = http.request(options, function (esRes) {
        esRes.pipe(res);
    });

    esReq.write(JSON.stringify(query));
    esReq.end();
});
