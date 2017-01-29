var should = require('should');
var cheerio = require('cheerio');
var fs = require('fs');
var Parser = require('../src/Parser.js');

function load(file) {
  return cheerio.load(fs.readFileSync('test/html/' + file));
}

describe('Parser', function() {

  before(function() {
    // var $ = cheerio.load(fs.readFileSync('test/test.html'));
  });

  describe('#isData', function() {

    it('should identify a data line', function() {
      let $ = load("data_line.html");
      let tr = $('tr');
      let parser = new Parser($);

      (parser.isData(tr)).should.be.exactly(true);
    });

    it('should identify a header line as not a data line', function() {
      let $ = load("header_line.html");
      let tr = $('tr');
      let parser = new Parser($);

      (parser.isData(tr)).should.be.exactly(false);
    })

  });
});
