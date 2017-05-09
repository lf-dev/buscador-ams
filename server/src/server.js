var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function(req, res) {

    var q = url.parse(req.url, true);
    console.log(q.pathname);

    if(q.pathname.endsWith('js') || q.pathname.endsWith('css') || q.pathname === "/") {

        if(q.pathname === "/"){
            q.pathname = "index.html"
        }

        fs.createReadStream("./" + q.pathname).pipe(res, function() {
            res.statusCode = 200;
            res.end();
        });
    }
    else if(q.pathname === '/search') {

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
        res.statusCode = 404;
        res.end();
    }

}).listen(3000);