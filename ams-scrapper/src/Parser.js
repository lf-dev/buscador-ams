var S = require('string'),
    fs = require('fs');

const TABLE_HEADER_BG_COLOR = "#b0dda4";
const docionarioEspecialidades = JSON.parse(fs.readFileSync('resources/especialidades_unicas.json'));

function Parser($) {
  this.$ = $;
}
module.exports = Parser;

Parser.prototype._getTd = function(tr, index) {
  return this.$(tr.find('>td')[index]);
}

Parser.prototype._getText = function(tr, index) {
  return this._getTd(tr, index).text().trim();
}

Parser.prototype.isData = function(tr) {
    return tr.css('background-color') !== TABLE_HEADER_BG_COLOR &&
            tr.find('>td').length === 9;
}

Parser.prototype.getPessoa = function(tr) {
    let td = this._getTd(tr, 0);
    let text = td.text();

    if(this._isPessoaJuridica(text)){
      return this._getPessoaJuridica(text);
    }else {
      return this._getPessoaFisica(td);
    }
}

Parser.prototype._isPessoaJuridica = function(text){
  return text.indexOf('CNPJ:') > -1;
}

Parser.prototype._getPessoaJuridica = function(text){

  const razao = "Razão Social:";
  const fantasia = "Nome Fantasia:";
  const cnpj = "CNPJ:";

  let indexRazao = text.indexOf(razao);
  let indexFantasia = text.indexOf(fantasia);
  let indexCNPJ = text.indexOf(cnpj);

  let pj = {
    "razao social": text.substring(indexRazao + razao.length, indexFantasia).trim(),
    "fantasia": text.substring(indexFantasia + fantasia.length, indexCNPJ).trim(),
    "cnpj": text.substring(indexCNPJ + cnpj.length, text.length-1).trim()
  };

  pj.id = pj.cnpj;
  return pj;
}

Parser.prototype._getPessoaFisica = function(td) {

    let conselhoTxt = td.find("font").text();
    let nome = td.text().replace(conselhoTxt, "").trim();

    let conselhoTxtTratado = this._tratarTextoConselho(conselhoTxt);
    let conselhoData = S(conselhoTxtTratado).trim()
                                      .replaceAll(" ","")
                                      .replaceAll("\r","")
                                      .replaceAll("\n",",")
                                      .s.split(",");

    let pf = {
      "nome": nome,
      "conselho": conselhoData[0],
      "numero": conselhoData[1],
      "estado": conselhoData[2]
    }

    pf.id = (pf.conselho ? pf.conselho : '') + ' ' + (pf.numero ? pf.numero : '') + ' ' + (pf.estado ? pf.estado : '');
    return pf;
}

Parser.prototype._tratarTextoConselho = function(conselhoTxt) {

    conselhoTxt = conselhoTxt.toUpperCase().trim();
    if(!conselhoTxt.startsWith("CPF")){
        return conselhoTxt;
    }

    //remove informacao de CPF
    var primeiroEspaco = conselhoTxt.indexOf(" ");
    conselhoTxt = conselhoTxt.substr(primeiroEspaco, conselhoTxt.length).trim();

    //altera a string de conselho inserindo virgulas para separar os digitos CCC NNNNNN CCCC
    var regex =  /[\d]+/;
    var num = regex.exec(conselhoTxt)[0];

    return conselhoTxt.replace(num, ","+num+",");

}

Parser.prototype.getEndereco = function(tr) {
    let td = this._getTd(tr, 3);

    let endereco = td.html().split('<br>');
    let rua = S(endereco[0]).collapseWhitespace().replaceAll(" ,",",").s;

    let cidadeEstado = endereco[1];
    let index = cidadeEstado.lastIndexOf('-');
    let cidade = cidadeEstado.substring(0, index).trim();
    let estado = cidadeEstado.substring(index+1, cidadeEstado.length-1).trim();

    return {
      "rua": rua,
      "cidade": cidade,
      "estado": estado
    }
}

Parser.prototype.getTelefone = function(tr) {
    let telefone = this._getText(tr, 5);
    return S(telefone).collapseWhitespace().s;
}

Parser.prototype.getEspecialidade = function(tr, dicionario) {
    let especialidade = this._getText(tr, 6);
    if(dicionario[especialidade]){
        return dicionario[especialidade];
    } else {
        return especialidade;
    }
}

Parser.prototype.toJSON = function(tr) {

    var endereco = this.getEndereco(tr);

    return {
        pessoa: this.getPessoa(tr),
        "tipo estabelecimento": this._getText(tr, 1),
        bairro: this._getText(tr, 2),
        rua: endereco.rua,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: this._getText(tr, 4),
        telefone: this.getTelefone(tr),
        especialidade: this.getEspecialidade(tr, docionarioEspecialidades)
    }
}
