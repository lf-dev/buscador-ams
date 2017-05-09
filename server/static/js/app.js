document.addEventListener('DOMContentLoaded', function () {

    console.log("carregou");

});

(function (global) {

    document.getElementById("buscar").addEventListener("click", function() {

        //var query = document.getElementById("query").value;
        //sendGetRequest("/search?q="+query, function(json) {
        //    console.log(json);
        //});

        document.getElementById("header").classList.add("top");
        document.getElementById("home-logo").classList.add("top");
    });

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