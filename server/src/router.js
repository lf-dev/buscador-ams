var http = require('http');
var url = require('url');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var staticBasePath = './static';
var serve = serveStatic(staticBasePath);


var createRouter = function (port) {
    var api = {};
    var routes = {};
    var methods = ['GET', 'POST', 'OPTIONS'];

    methods.forEach(function (method) {
        routes[method] = {};
        api[method.toLowerCase()] = function (path, fn) {
            routes[method][path] = fn;
        };
    });

    http.createServer(function (req, res) {

        var parsed = url.parse(req.url);
        console.log(req.connection.remoteAddress + ", " + parsed.path);

        if (!routes[req.method][parsed.pathname]) {

            var done = finalhandler(req, res);
            return serve(req, res, done);

        }
        routes[req.method][parsed.pathname](req, res);

    }).listen(port);

    return api;
};

module.exports = createRouter;