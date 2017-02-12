var S = require('string');

const TABLE_HEADER_BG_COLOR = "#b0dda4";

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

  return {
    "razao social": text.substring(indexRazao + razao.length, indexFantasia).trim(),
    "fantasia": text.substring(indexFantasia + fantasia.length, indexCNPJ).trim(),
    "cnpj": text.substring(indexCNPJ + cnpj.length, text.length-1).trim()
  }
}

Parser.prototype._getPessoaFisica = function(td) {

    let conselhoTxt = td.find("font").text();
    let nome = td.text().replace(conselhoTxt, "").trim();
    let conselhoData = S(conselhoTxt).trim()
                                      .replaceAll(" ","")
                                      .replaceAll("\r","")
                                      .replaceAll("\n",",")
                                      .s.split(",");

    return {
      "nome": nome,
      "conselho": conselhoData[0],
      "numero": conselhoData[1],
      "estado": conselhoData[2]
    }
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

Parser.prototype.toJSON = function(tr) {

    return {
      "pessoa": this.getPessoa(tr),
      "tipo estabelecimento": this._getText(tr, 1),
      "bairro": this._getText(tr, 2),
      "endereco": this.getEndereco(tr),
      "cep": this._getText(tr, 4),
      //"telefone": this._getText(tr, 5),
      "especialidade": this._getText(tr, 6)
    }
}
