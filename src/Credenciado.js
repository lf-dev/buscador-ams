var _ = require('lodash');
var Endereco = require('../src/Endereco.js');

function Credenciado(json) {

    this.pessoa = json.pessoa;
    this.enderecos = [new Endereco(json)];
}
module.exports = Credenciado;

Credenciado.prototype.equals = function(credenciado) {
    return credenciado.pessoa.id == this.pessoa.id;
}

Credenciado.prototype.merge = function(credenciado) {

    var self = this;
    _.forEach(credenciado.enderecos, function(otherEndereco) {

        let mesmoEndereco = _.find(self.enderecos, function(thisEndereco){
            return thisEndereco.equals(otherEndereco);
        } );

        //caso endereco nao exista na lista desse objeto, entao adiciona
        if(mesmoEndereco == null) {
            self.enderecos.push(otherEndereco);
        }
        //caso exista, mescla endereco do parametro com o desse objeto
        else {
            mesmoEndereco.merge(otherEndereco);
        }

    });

}