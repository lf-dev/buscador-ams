var http = require('http');
var url = require('url');
var router = require('./router');

var app = router(3000);

app.get('/search', function (req, res) {

    var pageSize = 10;
    var q = url.parse(req.url, true);
    console.log(q.query.q);
    console.log("page: " + q.query.from);

    var formData =
            {
                from: q.query.from*pageSize,
                size: pageSize,
                query: {
                    match: {
                        _all: {
                            query: q.query.q,
                            fuzziness: "AUTO"
                        }
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

    esReq.write(JSON.stringify(formData));
    esReq.end();
});