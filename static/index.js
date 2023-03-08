"use strict";

$(()=>{
    let questions=sendRequestNoCallback("/api/elencoDomande","GET",{});
    questions.done(function (serverData){
        // visualizzazione delle domande sulla pagina web
        serverData = JSON.parse(serverData)
        console.log(serverData.ris)


        let countQuestion = 0
        serverData.ris.forEach(quesito => {
            let question = $("<div>")
            question.append($("<h3>").text(quesito.domanda))
            let countAnswers = 0;
            quesito.risposte.forEach(risposta => {
                
                let div = $("<div>").addClass("form-check")
                
                let option = $("<input>").attr("type", "radio").attr("name",countQuestion)
                .val(countAnswers).addClass("form-check-input")
                div.append(option)
                let label = $("<label>").attr("for", countQuestion).text(risposta)
                .addClass("form-check-label")
                div.append(label)
                question.append(div)
                countAnswers++;
            })

            $("#elencoDomande").append(question)
            $("#elencoDomande").append($("<br>"))
            $("#elencoDomande").append($("<hr>"))
            countQuestion++;
        });

        let dataUser = sendRequestNoCallback("/api/user", "GET", {})
        dataUser.done(function(resp){
            console.log(resp)
            resp = JSON.parse(resp)
            let intestazione = $("<h2>").text("Test per " + resp.ris[0].user)
            $("#intestazione").append(intestazione)
        })
        dataUser.fail(function(err){
            console.log(err)
        })

    });
    questions.fail(function (jqXHR){
        error(jqXHR);
        window.location.href="login.html";
    });

    $("#btnLogout").on("click", function(){
        document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        window.location.href="login.html";
    })

});