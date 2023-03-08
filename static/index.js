"use strict";

$(()=>{
    let questions=sendRequestNoCallback("/api/elencoDomande","GET",{});
    questions.done(function (serverData){
        // visualizzazione delle domande sulla pagina web
        
    });
    questions.fail(function (jqXHR){
        error(jqXHR);
        window.location.href="login.html";
    });
});