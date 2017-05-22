document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("main-container").style.display = "none";

});

(function (global) {

    var PAGE_SIZE = 10;

    document.getElementById("query").addEventListener("keypress", function(e){
        if(e.keyCode == 13){
            realizarConsulta();
        }
    });

    document.getElementById("buscar").addEventListener("click", function() {
        realizarConsulta();
    });

    var transitionEvent = whichTransitionEvent();
    document.getElementById("header").addEventListener(transitionEvent, function(e) {
        document.getElementById("main-container").style.display = "block";
    });

    function whichTransitionEvent(){
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    function realizarConsulta() {

        var query = document.getElementById("query").value;

        if(!query){
            return;
        }

        document.getElementById("header").classList.add("top");
        document.getElementById("home-logo").classList.add("top");
        document.getElementById("main-container").innerHTML = "";

        carregarResultados(query, 0);
    }

    function carregarResultados(query, pagina) {

        sendGetRequest("/search?q="+query+"&from="+pagina, function(json) {
            preencherConsulta(json, query, pagina);
        });
    }

    function preencherConsulta(json, query, pagina) {

        removerBotaoPaginacao();

        var html = preencherHTMLConsulta(json);
        html += htmlBotaoPaginacao(json, pagina);

        var container = document.getElementById("main-container");
        container.innerHTML += html;

        incluirListnerPaginacao(query, pagina + 1);
    }

    function removerBotaoPaginacao(container) {

        var botaoPaginacao = document.getElementById("paginar");
        if(botaoPaginacao){
            botaoPaginacao.parentNode.removeChild(botaoPaginacao);
        }
    }

    function preencherHTMLConsulta(json) {
        var html = ""
        json.hits.hits.forEach(function(it) {
            html += obterHTMLCredenciado(it._source.credenciado);
        });
        return html;
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

    function htmlBotaoPaginacao(json, pagina) {

        if(json.hits.total > (pagina + 1)*PAGE_SIZE ) {
            return '<button id="paginar">carregar mais</button>';
        }else {
            return "";
        }
    }

    function incluirListnerPaginacao(query, pagina) {

        var botaoPaginacao = document.getElementById("paginar");
        if(botaoPaginacao){
            botaoPaginacao.addEventListener("click", function() {
                carregarResultados(query, pagina);
            });
        }
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