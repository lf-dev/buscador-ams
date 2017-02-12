var should = require('should');
var cheerio = require('cheerio');
var fs = require('fs');
var Parser = require('../src/Parser.js');

function load(file) {
  return cheerio.load(fs.readFileSync('test/html/' + file));
}

describe('Parser', function() {

  let $ = load("data_line.html");
  let tr = $('tr');
  let parser = new Parser($);

  let $PJ = load("pessoaJuridica.html");
  let trPJ = $PJ('tr');
  let parserPJ = new Parser($PJ);

  let $PF = load("pessoaFisica.html");
  let trPF = $PF('tr');
  let parserPF = new Parser($PF);

  describe('tr and tds', function() {

      it('should return the td from the nth index of the tr', function() {
        (parser._getTd(tr, 0).text()).should.be.exactly(' 0 ');
      });

      it('should return de td text from the nth index of the tr', function() {
        (parser._getText(tr, 0)).should.be.exactly('0');
      })

  });

  describe('#isData', function() {

    it('should identify a data line', function() {
      (parser.isData(tr)).should.be.exactly(true);
    });

    it('should identify a header line as not a data line', function() {
      let $ = load("header_line.html");
      let tr = $('tr');
      let parser = new Parser($);

      (parser.isData(tr)).should.be.exactly(false);
    });
  });

  describe('#getPessoa', function() {

    let expectedPJ = {
        "razao social": "ANGRA LAB LABORATORIO DE ANALISES CLINICAS ANGRA",
        "fantasia": "ANGRA LAB LABORATORIO DE ANALISES CLINICAS ANGRA 123",
        "cnpj": "28.588.747/0001-21"
    };

    let expectedPF = {
        "nome": "ALEXANDRE ALMEIDA L'HOTELLIER",
        "conselho": "CRO",
        "numero": "38064",
        "estado": "RJ"
    };

    it('should identify Pessoa Juridica', function() {

        let pjTxt = parserPJ._getTd(trPJ, Parser.INDEX_PESSOA).text();
        (parserPJ._isPessoaJuridica(pjTxt)).should.be.exactly(true);

        let pfTxt = parserPF._getTd(trPF, Parser.INDEX_PESSOA).text();
        (parserPF._isPessoaJuridica(pfTxt)).should.be.exactly(false);
    });

    it('should return Pessoa Juridica', function() {

        let pjTxt = parserPJ._getTd(trPJ, Parser.INDEX_PESSOA).text();
        (parserPJ._getPessoaJuridica(pjTxt)).should.be.eql(expectedPJ);
    });

    it('should return Pessoa Fisica', function() {

        let pfTd = parserPJ._getTd(trPF, Parser.INDEX_PESSOA);
        (parserPF._getPessoaFisica(pfTd)).should.be.eql(expectedPF);
    });

    it('should return Pessoa', function() {

      let actualPF = parserPF.getPessoa(trPF);
      (actualPF).should.be.eql(expectedPF);

      let actualPJ = parserPJ.getPessoa(trPJ);
      (actualPJ).should.be.eql(expectedPJ);
    });

  });

  describe('#getTipoEstabelecimento', function() {

      it('should return tipo estabelecimento', function() {

        let actualEstabelecimentoPF = parserPF.getTipoEstabelecimento(trPF);
        (actualEstabelecimentoPF).should.be.exactly('CONSULTORIO ODONTOLOGICO');

        let actualEstabelecimentoPJ = parserPJ.getTipoEstabelecimento(trPJ);
        (actualEstabelecimentoPJ).should.be.exactly('LABORATORIO');
      });
  });

});
