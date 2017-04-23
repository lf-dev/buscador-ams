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
