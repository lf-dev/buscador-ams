var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var url = require('url');

var staticBasePath = './static';

var serve = serveStatic(staticBasePath);

var server = http.createServer(function(req, res){

    var q = url.parse(req.url, true);

    if(q.pathname === '/search') {

        console.log(q.query.q);
        var formData = { "query":{ "fuzzy": {"_all": q.query.q}}} ;

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
    }
    else {
        var done = finalhandler(req, res);
        serve(req, res, done);
    }
});

server.listen(3000);

