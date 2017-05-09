var _ = require('lodash');

function Endereco(json) {

    this.rua = json.rua;
    this.bairro = json.bairro;
    this.cidade = json.cidade;
    this.estado = json.estado;
    this.cep = json.cep;
    this.telefones = [json.telefone];
    this.tipos = [json['tipo estabelecimento']];
    this.especialidades = [json.especialidade];

}
module.exports = Endereco;

Endereco.prototype.equals = function(endereco) {

    return this.rua == endereco.rua &&
            this.cidade == endereco.cidade &&
            this.estado == endereco.estado &&
            this.cep == endereco.cep
}

Endereco.prototype.merge = function(endereco) {

    this.telefones = _.union(this.telefones, endereco.telefones);
    this.tipos = _.union(this.tipos, endereco.tipos);
    this.especialidades = _.union(this.especialidades, endereco.especialidades);
}
