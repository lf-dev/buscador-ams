function Credenciado(json) {

    this.pessoa = json.pessoa;

    this.tipos_estabelecimentos = [json['tipo estabelecimento']];
    this.bairros = [json.bairro];
    this.enderecos = [json.endereco];
    this.ceps = [json.cep];
    this.telefones = [json.telefone];
    this.especialidades = [json.especialidade];
}
module.exports = Credenciado;
