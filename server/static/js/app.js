document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("main-container").style.display = "none";
    document.getElementById("query").focus();

    window.realizarConsultaAPartirDeHash();

});

(function (global) {

    var PAGE_SIZE = 10;
    const queryBox = document.querySelector(".query-box");
    const queryField = document.getElementById("query");
    const suggestions = document.querySelector(".suggestions");
    const lupa = document.getElementById("lupa");
    const info = document.getElementById("info");

    queryField.addEventListener("keydown", function(e){
        if(e.keyCode == 13){
            aplicarSugestao();
            realizaConsultaComHistorico();
        }else if(e.keyCode == 38){
            //preventDefault evita que o cursor volte para o inicio
            e.preventDefault();
            moverSelecaoSugestao(true);
        }else if(e.keyCode == 40){
            moverSelecaoSugestao(false);
        }else if(e.keyCode == 27){
            esconderSugestoes();
        }else {
            handleAutocomplete(e);
        }
    });

    lupa.addEventListener("click", realizaConsultaComHistorico);

    suggestions.addEventListener('mousemove', function(e) {

        const suggestion = e.target;
        if(suggestion.matches('li') && !suggestion.matches('.selected')) {

            const selected = suggestions.querySelector(".selected");
            if(selected) {
                selected.classList.remove("selected");
            }

            suggestion.classList.add('selected');
        }
    })

    suggestions.addEventListener('click', function(e) {
        aplicarSugestao();
        realizaConsultaComHistorico();
    });

    info.addEventListener('click', function(e) {
        e.preventDefault();
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

    window.addEventListener("popstate", function(e){

        if(!location.hash){
            location.reload(false);
        }

        realizarConsultaAPartirDeHash();
    });

    global.realizarConsultaAPartirDeHash = function() {
        var queryWithHash = window.location.hash;
        if(queryWithHash && queryWithHash.length > 1) {

            var query = queryWithHash.substr(1, queryWithHash.length);
            document.getElementById("query").value = query
            realizarConsulta(query);
        }
    }

    function moverSelecaoSugestao(up) {
        const sugestaoSelecionada = suggestions.querySelector('.selected');
        const totalSugestoes = suggestions.querySelectorAll('li').length;

        let index;
        if(sugestaoSelecionada) {
            index = parseInt(sugestaoSelecionada.dataset.index) + (up ? -1 : 1);
            if(index < 0){
              index = totalSugestoes - 1;
            } else if(index == totalSugestoes) {
              index = 0;
            }

            sugestaoSelecionada.classList.remove('selected');
        } else {
            index = up ? totalSugestoes -1 : 0;
        }

        const proximaSugestao = suggestions.querySelector(`[data-index="${index}"]`);
        proximaSugestao.classList.add('selected');
    }

    function aplicarSugestao() {
        const sugestaoSelecionada = suggestions.querySelector('.selected');
        if(sugestaoSelecionada) {
            queryField.value = sugestaoSelecionada.innerText;
        }
    }

    function esconderSugestoes() {
        suggestions.style.display = "none";
        queryBox.classList.remove("query-box-with-suggestions");
    }

    function exibirSugestoes() {
        suggestions.style.display = "block";
        queryBox.classList.add("query-box-with-suggestions");
    }

    function handleAutocomplete(e) {
      if(e.target.value.split(' ').length >= 2) {
        realizarConsultaAutocomplete(e.target.value);
      }
    }

    function realizarConsultaAutocomplete(query) {
      sendGetRequest(`/autocomplete?q=${query}`, function(json) {
        preencherAutocomplete(json);
      });
    }

    function preencherAutocomplete(json) {
      const html = json.aggregations.autocomplete.buckets.map( (suggestion, index) => {
        return `<li data-index="${index}" >${suggestion.key}</li>`;
      }).join('');
      suggestions.innerHTML = html;

      if(json.aggregations.autocomplete.buckets.length > 0){
          exibirSugestoes();
      }
    }

    function realizaConsultaComHistorico() {

        esconderSugestoes();

        var query = document.getElementById("query").value;
        if(!query) {
            return;
        }

        window.history.pushState(null, null, "#" + query);
        realizarConsulta(query);

    }

    function realizarConsulta(query) {

        document.getElementById("header").classList.add("top");
        document.getElementById("home-logo").classList.add("top");
        info.classList.add("top");

        carregarResultados(query, 0);
    }

    function carregarResultados(query, pagina) {

        sendGetRequest("/search?q="+query+"&from="+pagina, function(json) {
            preencherConsulta(json, query, pagina);

            if(ga){
                ga('set', 'page', '/search');
                ga('send', 'pageview');
            }
        });
    }

    function preencherConsulta(json, query, pagina) {

        var container = document.getElementById("main-container");

        removerBotaoPaginacao();

        var html = "";
        if(pagina == 0) {
            container.innerHTML = "";
            html = htmlTotalResultados(json);
            html += htmlDidYouMean(json);
        }

        html += preencherHTMLConsulta(json);
        html += htmlBotaoPaginacao(json, pagina);


        container.innerHTML += html;

        incluirListnerPaginacao(query, pagina + 1);
    }

    function removerBotaoPaginacao(container) {

        var botaoPaginacao = document.getElementById("paginar");
        if(botaoPaginacao){
            botaoPaginacao.parentNode.removeChild(botaoPaginacao);
        }
    }

    function htmlTotalResultados(json) {
        return '<p id="sumario-resultados">Encontrados ' + json.hits.total + ' resultados</p>';
    }

    function htmlDidYouMean(json) {

        let html = '';
        if(json.suggest.didYouMean[0].options.length > 0){
          html += "<p id='did-you-mean'><span>Você quis dizer:</span>";
          html += json.suggest.didYouMean[0].options.map( option => {
            return ` <a href='/#${option.text}'>${option.text}</a>`;
          }).join(',');
          html += '</p>';
        }
        return html;
    }

    function preencherHTMLConsulta(json) {
        var html = ""
        json.hits.hits.forEach(function(it) {
            html += obterHTMLCredenciado(it._source);
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
            obterHTMLTelefone(endereco.telefones) +
            "<p class='endereco'>" +
            endereco.tipos.join(", ") + ": " +
            endereco.rua + ", " +
            "CEP: " + endereco.cep + " - " +
            endereco.bairro + " - " +
            endereco.cidade + " - " +
            endereco.estado + "</p>"
        return html;
    }

    function obterHTMLTelefone(telefones) {
        var html = "<p class='telefone'>";

        telefones.forEach(function(telefone) {
            html += "<a href='tel:" + telefone + "'>" + telefone + "</a>";
        });

        html += "</p>";

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
