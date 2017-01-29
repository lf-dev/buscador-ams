var S = require('string');

const TABLE_HEADER_BG_COLOR = "#b0dda4";
const INDEX_NOME = 0;

function Parser($) {
  this.$ = $;
}
module.exports = Parser;

Parser.prototype.isData = function(tr) {
    return tr.css('background-color') !== TABLE_HEADER_BG_COLOR &&
            tr.find('>td').length === 9;
}

Parser.prototype.getNome = function(tr) {
    let td = this.$(tr.find('>td')[INDEX_NOME])
    let text = td.text();

    if(this.isEmpresa(text)){
      return this.getEmpresa(text);
    }else {
      return this.getPessoaFisica(td);
    }

    return " ";
}

Parser.prototype.isEmpresa = function(text){
  return text.indexOf('CNPJ:') > -1;
}

Parser.prototype.getEmpresa = function(text){

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

Parser.prototype.getPessoaFisica = function(td) {

    let conselhoTxt = td.find("font").text();
    let nome = td.text().replace(conselhoTxt, "").trim();
    let conselhoData = S(conselhoTxt).trim().replaceAll(" ","").replaceAll("\r\n",",").s.split(",");

    return {
      "nome": nome,
      "conselho": conselhoData[0],
      "numero": conselhoData[1],
      "estado": conselhoData[2]
    }
}
