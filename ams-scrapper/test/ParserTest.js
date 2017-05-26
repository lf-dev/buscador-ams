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

  let expectedJsonPJ = {
      pessoa: {
        "razao social": "ANGRA LAB LABORATORIO DE ANALISES CLINICAS ANGRA",
        fantasia: "ANGRA LAB LABORATORIO DE ANALISES CLINICAS ANGRA 123",
        cnpj: "28.588.747/0001-21",
        id: "28.588.747/0001-21"
      },
      "tipo estabelecimento": "LABORATORIO",
      bairro: "CENTRO",
      rua: "RUA DOS CONEGOS BITTENCOURT, 22, (ANTIGA N 28)",
      cidade: "ANGRA DOS REIS",
      estado: "RJ",
      cep: "23.900-300",
      telefone: "(24) 3365-2808",
      especialidade: "LAB.DE ANALISES CLINICAS"
  };

  let $PF = load("pessoaFisica.html");
  let trPF = $PF('tr');
  let parserPF = new Parser($PF);
  let expectedJsonPF = {
      pessoa: {
        nome: "ALEXANDRE ALMEIDA L'HOTELLIER",
        conselho: "CRO",
        numero: "38064",
        estado: "RJ",
        id: "CRO 38064 RJ"
      },
      "tipo estabelecimento": "CONSULTORIO ODONTOLOGICO",
      bairro: "CENTRO",
      rua: "TRAVESSA JORDAO GALINDO, 30, SALA 102",
      cidade: "ANGRA DOS REIS",
      estado: "RJ",
      cep: "23.900-470",
      telefone: "(24) 3368-5329",
      especialidade: "ORTODONTIA"
  };

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

    it('should identify Pessoa Juridica', function() {

        let pjTxt = parserPJ._getTd(trPJ, 0).text();
        (parserPJ._isPessoaJuridica(pjTxt)).should.be.exactly(true);

        let pfTxt = parserPF._getTd(trPF, 0).text();
        (parserPF._isPessoaJuridica(pfTxt)).should.be.exactly(false);
    });

    it('should return Pessoa Juridica', function() {

        let pjTxt = parserPJ._getTd(trPJ, 0).text();
        (parserPJ._getPessoaJuridica(pjTxt)).should.be.eql(expectedJsonPJ.pessoa);
    });

    it('should return Pessoa Fisica', function() {

        let pfTd = parserPJ._getTd(trPF, 0);
        (parserPF._getPessoaFisica(pfTd)).should.be.eql(expectedJsonPF.pessoa);
    });

    it('should return Pessoa', function() {

        let actualPF = parserPF.getPessoa(trPF);
        (actualPF).should.be.eql(expectedJsonPF.pessoa);

        let actualPJ = parserPJ.getPessoa(trPJ);
        (actualPJ).should.be.eql(expectedJsonPJ.pessoa);
    });

    it('should remove CPF from conselho when needed', function() {

        let conselhoWithCPF = "CPF:313.803.558-26          CREFITO8272RJ";
        let conselhoTratado = parser._tratarTextoConselho(conselhoWithCPF);

        (conselhoTratado).should.be.eql("CREFITO,8272,RJ");
    });

  });

  describe('#getEndereco', function() {

      it('should return the PJ address', function() {

          let actualAddress = parserPJ.getEndereco(trPJ);
          let expectedAddress = {
              rua: expectedJsonPJ.rua,
              cidade: expectedJsonPJ.cidade,
              estado: expectedJsonPJ.estado
          };

          (actualAddress).should.be.eql(expectedAddress);

      });
  });

  describe('#getTelefone', function() {
      it('should return the PJ phone number', function() {

          let actual = parserPJ.getTelefone(trPJ);
          (actual).should.be.exactly(expectedJsonPJ.telefone);
      })
  })

  describe('#toJSON', function() {

      it('should return json PF', function() {
          let actualJsonPF = parserPF.toJSON(trPF);
          (actualJsonPF).should.be.eql(expectedJsonPF);
      });

      it('should return json PJ', function() {
          let actualJsonPJ = parserPJ.toJSON(trPJ);
          (actualJsonPJ).should.be.eql(expectedJsonPJ);
      });
  });

});
