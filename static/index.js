"use strict";

$(()=>{
    let questions=sendRequestNoCallback("/api/elencoDomande","GET",{});
    questions.done(function (serverData){
        // visualizzazione delle domande sulla pagina web
        serverData = JSON.parse(serverData)
        console.log(serverData.ris)

        let r = "ABCDEF";
        let countQuestion = 0
        let countTotalAnswers = 0;
        serverData.ris.forEach(quesito => {
            let question = $("<div>")
            question.append($("<h3>").text(quesito.domanda))
            let countAnswers = 0;
            
            for(let i = 0; i < quesito.risposte.length; i++){
                //console.log(quesito.risposte[i])
                let div = $("<div>").addClass("form-check")
                
                let option = $("<input>").attr("type", "radio").attr("name","ANS" + countQuestion)
                .val(r[i]).addClass("form-check-input").attr("id",countTotalAnswers)
                div.append(option)
                console.log(r[i])
                console.log(quesito.risposte[i][r[i]])
                let label = $("<label>").attr("for", countTotalAnswers).text(quesito.risposte[i][r[i]])
                .addClass("form-check-label")
                div.append(label)
                question.append(div)
                countAnswers++;
                countTotalAnswers++
            }

            $("#elencoDomande").append(question)
            $("#elencoDomande").append($("<br>"))
            $("#elencoDomande").append($("<hr>"))
            countQuestion++;
        });

        let dataUser = sendRequestNoCallback("/api/user", "GET", {})
        dataUser.done(function(resp){
            console.log("resp")
            console.log(resp)
            resp = JSON.parse(resp)
            let intestazione = $("<h1>").text("Test per " + resp.ris[0].user)
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
    $("#consegna").on("click", function(){
        $('#modalAvviso').modal('show');
    })
    
    $("#btnLogout").on("click", function(){
        localStorage.removeItem("token")
        
        window.location.href="login.html";
    })
    
    $("#sendRisposte").on("click", function(){
        let answers = []
        let r = "ABCDEF"
        for (let i = 0; i < 10; i++){
            let val = $("input[name='ANS" + i+"']:checked").val()
            let ans = {};
            ans["ANS" + i] = val
            answers.push(ans)
            
        }
        let sendAnswers = sendRequestNoCallback("/api/sendRisposte", "POST", answers)
        sendAnswers.done(function(resp){
            console.log(answers)
            window.location.href="personalPage.html";
        })
        sendAnswers.fail(function(err){
            error(err)
        })
    })

});