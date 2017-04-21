var should = require('should');
var Credenciado = require('../src/Credenciado.js');

describe('Credenciado', function() {

    let json = {
        "pessoa": {
            "razao social": "razao social ltda",
            "fantasia": "fantasia",
            "cnpj": "12345",
            "id": "12345"
        },
        "tipo estabelecimento": "especialidade 1",
        "bairro": "bairro",
        "endereco": {
            "rua": "rua abc",
            "cidade": "cidade abc",
            "estado": "ABC"
        },
        "cep": "12345-678",
        "telefone": "1234-1234",
        "especialidade": "especialidade"
    };

    it('should create a Credenciado', function(){

        let credenciado = new Credenciado(json);
        credenciado.pessoa.should.be.equal(json.pessoa);
        credenciado.tipos_estabelecimentos.should.be.eql([json['tipo estabelecimento']]);
        credenciado.bairros.should.be.eql([json.bairro]);
        credenciado.enderecos.should.be.eql([json.endereco]);
        credenciado.ceps.should.be.eql([json.cep]);
        credenciado.telefones.should.be.eql([json.telefone]);
        credenciado.especialidades.should.be.eql([json.especialidade]);

    });

    it('should identify equality by pessoa.id property', function() {

        let c1 = new Credenciado({pessoa: {id: 123}});
        let c2 = new Credenciado({pessoa: {id: 123}});
        let c3 = new Credenciado({pessoa: {id: 456}});

        c1.equals(c2).should.be.true();
        c2.equals(c1).should.be.true();

        c3.equals(c1).should.not.be.true();
        c3.equals(c2).should.not.be.true();
        c1.equals(c3).should.not.be.true();
        c2.equals(c3).should.not.be.true();
    });
});