var request = require('request');

const siteUrl = "http://localhost:3000";
const search = "/search";
const resources = ['/js/app.js', '/css/styles.css'];

function User() {

    this.events = [];

}

User.prototype._request = function(url, resolve) {
    request(url, function(error, response, body) {

        if(response.statusCode != 200){
            console.error("erro ao requisitar " + url);
        }

        if(resolve){
            resolve();
        }
    });
}

User.prototype.land = function() {

    var event = {
        type: 'land',
        start: Date.now()
    }
    var self = this;
    var start = new Date().getTime();

    new Promise(function(resolve, reject) {
        self._request(siteUrl, resolve);

    }).then(function(resolve, reject) {

        var promises = resources.map(function(resource) {
            return new Promise(function(resolve, reject) {
                self._request(siteUrl + resource, resolve);
            });
        });

        Promise.all(promises).then(function() {
            event.end = Date.now();
            self.events.push(event);
        });
    });
}

User.prototype.search = function() {

    var event = {
        type: 'search',
        start: Date.now()
    }

    var query = this._createQuery();
    var params = "?q="+query.q+"&"+query.from;
    this._request(siteUrl + search + params);
}

User.prototype._createQuery = function() {

    return {
        q: "ortopedista rio de janeiro",
        from: 0
    }
}

var u = new User();
u.land();
u.search();
