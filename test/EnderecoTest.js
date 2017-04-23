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
        "tipo estabelecimento": "especialidade 1",
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
        endereco.estado.should.be.eql(json.estado);
        endereco.cep.should.be.eql(json.cep);
        endereco.telefones.should.be.eql([json.telefone]);
        endereco.tipos.should.be.eql([json["tipo estabelecimento"]]);
        endereco.especialidades.should.be.eql([json.especialidade]);

    });
});