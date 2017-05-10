document.addEventListener('DOMContentLoaded', function () {

    console.log("carregou");

});

(function (global) {

    document.getElementById("query").addEventListener("keypress", function(e){
        if(e.keyCode == 13){
            realizarConsulta();
        }
    });

    document.getElementById("buscar").addEventListener("click", function() {
        realizarConsulta();
    });

    function realizarConsulta() {

        var query = document.getElementById("query").value;

        if(!query){
            return;
        }

        document.getElementById("header").classList.add("top");
        document.getElementById("home-logo").classList.add("top");

        sendGetRequest("/search?q="+query, function(json) {
            preencherConsulta(json);
        });
    }

    function preencherConsulta(json) {

        var container = document.getElementById("main-container");

        var html = ""
        json.hits.hits.forEach(function(it) {
            html += obterHTMLCredenciado(it._source.credenciado);
        });

        container.innerHTML = html;
    }

    function obterHTMLCredenciado(credenciado){

        var html = "<div class='row'>" +
                    "<p class='nome-credenciado'>" + obterNome(credenciado.pessoa) + "</p>" +
                    "<p class='conselho'>" + obterConselho(credenciado.pessoa) + "</p>";

        credenciado.enderecos.forEach(function(endereco){
            html += obterHTMLEndereco(endereco);
        });


        html += "</div>";

        return html;
    }

    function obterHTMLEndereco(endereco) {
        var html = "<p class='especialidades'>" + endereco.especialidades.join(", ") + "</p>" +
                    "<p class='telefone'>" + endereco.telefones.join(", ") + "</p>" +
                    "<p class='endereco'>" +
                            endereco.tipos.join(", ") + ": " +
                            endereco.rua + ", " +
                            "CEP: " + endereco.cep + " - " +
                            endereco.bairro + " - " +
                            endereco.cidade + " - " +
                            endereco.estado + "</p>"
        return html;
    }

    function obterNome(pessoa) {
        if(isPessoaJuridica(pessoa)){
            return pessoa["razao social"]
        }else {
            return pessoa.nome;
        }
    }

    function obterConselho(pessoa) {
        if(isPessoaJuridica(pessoa)){
            return pessoa.fantasia + ", CNPJ: " + pessoa.cnpj;
        }else {
            return pessoa.id;
        }
    }

    function isPessoaJuridica(pessoa) {
        return pessoa.cnpj != undefined;
    }

    function obterEspecialidades(credenciado) {

    }

    // Returns an HTTP request object
    function getRequestObject() {
        if (window.XMLHttpRequest) {
            return (new XMLHttpRequest());
        }
        else if (window.ActiveXObject) {
            // For very old IE browsers (optional)
            return (new ActiveXObject("Microsoft.XMLHTTP"));
        }
        else {
            global.alert("Ajax is not supported!");
            return (null);
        }
    }


    // Makes an Ajax GET request to 'requestUrl'
    function sendGetRequest (requestUrl, responseHandler) {
        var request = getRequestObject();
        request.onreadystatechange =
            function () {
                if ((request.readyState == 4) && (request.status == 200)) {
                    responseHandler(JSON.parse(request.responseText));
                }
            };
        request.open("GET", requestUrl, true);
        request.send(null); // for POST only
    };

})(window);