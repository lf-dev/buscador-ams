var Endereco = require('../src/Endereco.js');

function Credenciado(json) {

    this.pessoa = json.pessoa;
    this.enderecos = [new Endereco(json)];
}
module.exports = Credenciado;

Credenciado.prototype.equals = function(credenciado) {
    return credenciado.pessoa.id == this.pessoa.id;
}

