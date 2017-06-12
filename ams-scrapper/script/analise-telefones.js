/**
 * Verifica quais os formatos de telefones existentes
 */

var fs = require('fs'),
    readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('credenciados.json'),
    console: false
});

var credenciados = [];

rd.on('line', function(line) {
    credenciados.push(JSON.parse(line));
});

rd.on('close', function() {

    var regexes = [
                    /^\([\d]{2}\) [\d]{4}-[\d]{4}$/,  // (11) 1111-1111
                    /^[\d]{4}-[\d]{4}$/               // 1111-1111
    ];

    var count = regexes.reduce(function(map, regex) {
        map[regex] = 0;
        return map;
    }, {});

    var noMatch = [];

   credenciados.forEach(function(cred) {
       cred.enderecos.forEach(function(end) {
           end.telefones.forEach(function(tel) {

               var matchedOne = false;
               regexes.forEach(function(regex) {

                   if(regex.test(tel)){
                       count[regex] += 1;
                       matchedOne = true;
                   }

               });

               if(!matchedOne) {
                   noMatch.push(tel);
               }
           });
       });
   });

    console.log(noMatch);
    console.log(count);


});
