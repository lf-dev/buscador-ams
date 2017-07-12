var http = require('http');
var url = require('url');
var router = require('./router');

var app = router(3000);

app.get('/autocomplete', function(req, res) {

  var q = url.parse(req.url, true).query.q.toLowerCase();

  const query = {
    "size": 0,
    "aggs": {
      "autocomplete": {
        "terms": {
          "field": "autocomplete",
          "order": {
            "_count": "desc"
          },
          "include":  `${q}.*`
        }
      }
    },
    "query": {
      "prefix": {
        "autocomplete": {
          "value": q
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

  var esReq = http.request(options, function(esRes) {
    esRes.pipe(res);
  });

  esReq.write(JSON.stringify(query));
  esReq.end();
});

app.get('/search', function(req, res) {

  var pageSize = 10;
  var q = url.parse(req.url, true);

  var query = {
    "from": q.query.from * pageSize,
    "size": pageSize,
    "query": {
      "bool": {
        "must": {
          "match": {
            "_all_standard": {
              "query": q.query.q
            }
          }
        },
        "should": [
          {
            "match": {
              "pessoa.nome": {
                "query": q.query.q,
                "minimum_should_match": 2
              }
            }
          },
          {
            "match": {
              "enderecos.especialidades.br": q.query.q
            }
          },
          {
            "match": {
              "enderecos.cidade": q.query.q
            }
          }]
      }
    },
    "suggest": {
      "didYouMean": {
        "text": q.query.q,
        "phrase": {
          "field": "_all_standard"
        }
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
