var request = require('request');

const siteUrl = "http://localhost:3000";
const search = "/search";
const resources = ['/js/app.js', '/css/styles.css'];

function User() {

    this.events = [];
    this.stack = [];
}

User.prototype._request = function(url, stack, cb) {

    var self = this;
    request(url, function(error, response, body) {

        if(stack){
            self.stack.push(url);
        }

        if(response.statusCode != 200){
            console.error("erro ao requisitar " + url);
        }

        if(cb){
            cb();
        }
    });
}

User.prototype.land = function() {
    var self = this;
    return new Promise(function(resolve) {
        self._land(resolve);
    });
}

User.prototype._land = function(done) {

    var event = {
        type: 'land',
        start: Date.now()
    }
    var self = this;
    var start = new Date().getTime();

    new Promise(function(resolve, reject) {
        self._request(siteUrl, true, resolve);

    }).then(function() {

        var promises = resources.map(function(resource) {
            return new Promise(function(resolve, reject) {
                self._request(siteUrl + resource, false, resolve);
            });
        });

        Promise.all(promises).then(function() {
            event.end = Date.now();
            self.events.push(event);
            if(done) done();
        });
    });
}

User.prototype.search = function(){
    var self = this;
    return new Promise(function(resolve){
        self._search(resolve);
    });
}

User.prototype._search = function(done) {

    var event = {
        type: 'search',
        start: Date.now()
    }
    var self = this;

    var query = this._createQuery();
    var params = "?q="+query.q+"&"+query.from;
    this._request(siteUrl + search + params, true, function() {
        event.end = Date.now();
        self.events.push(event);
        if(done) done();
    });
}

User.prototype._createQuery = function() {

    return {
        q: "ortopedista rio de janeiro",
        from: 0
    }
}

User.prototype.back = function(){
    var self = this;
    return new Promise(function(resolve){
        self._back(resolve);
    });
}

User.prototype._back = function(done) {

    var event = {
        type: 'back',
        start: Date.now()
    }
    var self = this;

    var url = this.stack.pop();
    this._request(url, false, function() {
        event.end = Date.now();
        self.events.push(event);
        if(done) done();
    });
}

var u = new User();

Promise.resolve()
    .then(function() {
        return u.land();
    })
    .then(function(){
        return u.search();
    })
    .then(function(){
        return u.back();
    })