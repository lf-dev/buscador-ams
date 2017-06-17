var http = require('http');
var url = require('url');
var router = require('./router');

var app = router(3000);

app.get('/search', function(req, res) {

  var pageSize = 10;
  var q = url.parse(req.url, true);

  var query = {
    "from": q.query.from * pageSize,
    "size": pageSize,
    "query": {
      "bool": {
        "must": {
          "multi_match": {
            "query": q.query.q,
            "fields": ["_all"],
            "type": "cross_fields"
          }
        },
        "should": [
          {
            "match": {
              "pessoa.nome": q.query.q
            }
          },
          {
            "match": {
              "enderecos.especialidades": q.query.q
            }
          }]
      }
    }
  }

  var options = {
    host: 'localhost',
    port: 9200,
    path: '/ams/credenciado/_search',
    method: 'POST'
  };

  var esReq = http.request(options, function(esRes) {
    esRes.pipe(res);
  });

  esReq.write(JSON.stringify(query));
  esReq.end();
});
