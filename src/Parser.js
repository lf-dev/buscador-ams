var S = require('string');

const TABLE_HEADER_BG_COLOR = "#b0dda4";
Parser.INDEX_PESSOA = 0;
Parser.INDEX_TIPO_ESTABELECIMENTO = 1;

function Parser($) {
  this.$ = $;
}
module.exports = Parser;

Parser.prototype._getTd = function(tr, index) {
  return this.$(tr.find('>td')[index]);
}

Parser.prototype.isData = function(tr) {
    return tr.css('background-color') !== TABLE_HEADER_BG_COLOR &&
            tr.find('>td').length === 9;
}

Parser.prototype.getPessoa = function(tr) {
    let td = this._getTd(tr, Parser.INDEX_PESSOA);
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

Parser.prototype.getTipoEstabelecimento = function(tr) {
    return this.$(tr.find('>td')[Parser.INDEX_TIPO_ESTABELECIMENTO]).text().trim();
}
