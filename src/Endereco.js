function Endereco(json) {

    this.rua = json.rua;
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
