var http = require('http');
var url = require('url');
var router = require('./router');

var app = router(3000);

app.get('/search', function (req, res) {

    var q = url.parse(req.url, true);
    console.log(q.query.q);
    var formData =
            {
                from: 0,
                size: 10000,
                "query":
                {
                    "fuzzy": {"_all": q.query.q}
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