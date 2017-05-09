var should = require('should');
var Endereco = require('../src/Endereco.js');

describe('Endereco', function() {

    let json = {
        pessoa: {
            "razao social": "razao social ltda",
            fantasia: "fantasia",
            cnpj: "12345",
            id: "12345"
        },
        "tipo estabelecimento": "tipo 1",
        bairro: "bairro",
        rua: "rua abc",
        cidade: "cidade abc",
        estado: "ABC",
        cep: "12345-678",
        telefone: "1234-1234",
        especialidade: "especialidade"
    };

    it('should create a Endereco', function(){

        let endereco = new Endereco(json);

        endereco.rua.should.be.eql(json.rua);
        endereco.cidade.should.be.eql(json.cidade);
        endereco.bairro.should.be.eql(json.bairro);
        endereco.estado.should.be.eql(json.estado);
        endereco.cep.should.be.eql(json.cep);
        endereco.telefones.should.be.eql([json.telefone]);
        endereco.tipos.should.be.eql([json["tipo estabelecimento"]]);
        endereco.especialidades.should.be.eql([json.especialidade]);
    });

    it('should identify equality by rua, cidade, estado and cep property', function() {

        let e1 = new Endereco(json);
        let e2 = new Endereco(json);

        e1.equals(e2).should.be.true();
        e2.equals(e1).should.be.true();

        let e3 = new Endereco(json);
        e3.rua = json.rua + "abc";
        e3.equals(e1).should.not.be.true();

        e3.rua = json.rua;
        e3.cidade = json.cidade + "abc"
        e3.equals(e1).should.not.be.true();

        e3.cidade = json.cidade;
        e3.estado = json.estado + "abc";
        e3.equals(e1).should.not.be.true();

        e3.estado = json.estado;
        e3.cep = json.cep + "abc";
        e3.equals(e1).should.not.be.true();
    });

    it('should merge enderecos', function() {

        let e1 = new Endereco(json);
        let e2 = new Endereco(json);
        e2.telefones = ["4321-4321"];
        e2.tipos = ["tipo 1", "tipo 2"];
        e2.especialidades = ["especialidade 2"];

        e1.merge(e2);

        e1.telefones.should.be.eql(["1234-1234","4321-4321"]);
        e1.tipos.should.be.eql(["tipo 1", "tipo 2"]);
        e1.especialidades.should.be.eql(["especialidade", "especialidade 2"]);

    });

});