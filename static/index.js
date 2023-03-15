"use strict";

$(()=>{
    let votoId ="";
    console.log(window.location.search)
    let params = {
        id: window.location.search.split('=')[1]
    }
    console.log(params)
    let questions=sendRequestNoCallback("/api/getDomande","GET",params);
    questions.done(function (serverData){
        
        
        // visualizzazione delle domande sulla pagina web

        serverData = JSON.parse(serverData)
        console.log("-----")
        console.log(serverData)
        let r = "ABCDEF";
        let countQuestion = 0
        let countTotalAnswers = 0;
        for(let i = 0; i < serverData.length; i++){
            
            let quesito = serverData[i][0]
            console.log(quesito)
            let question = $("<div>")
            question.append($("<h3>").text(quesito.domanda))
            let countAnswers = 0;
            
            for(let i = 0; i < quesito.risposte.length; i++){
                //console.log(quesito.risposte[i])
                let div = $("<div>").addClass("form-check")
                
                let option = $("<input>").attr("type", "radio").attr("name","ANS" + countQuestion)
                .val(i).addClass("form-check-input").attr("id",countTotalAnswers)
                div.append(option)
                console.log(i)
                console.log(quesito.risposte[i])
                let label = $("<label>").attr("for", countTotalAnswers).text(quesito.risposte[i])
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
        };

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
        $("#modalAvviso").hide();
        let answers = {}
        let r = "ABCDEF"
        
        for (let i = 0; i < 10; i++){
            let val = $("input[name='ANS" + i+"']:checked").val()
            let ans = {};
            //ans["ANS" + i] = val
            answers["ANS" + i] = val
            
        }
        let params = {
            _id :window.location.search.split('=')[1],
            answers: answers
        }
        let sendAnswers = sendRequestNoCallback("/api/sendRisposte", "POST", params)
        sendAnswers.done(function(resp){
            //alert(resp)
            votoId = JSON.parse(resp).ris[0]
            //votoId = resp.split("insertedId\":\"")[1].split("\"}}")[0]
            setTimeout(function(){
                $("#modalVoto").show();
                console.log(votoId.giuste + " " + votoId.totale)
                let voto = votoId.giuste * 10 / votoId.totale
                $("#bigVoto").text(voto)
            }, 1000)
                        
        })
        sendAnswers.fail(function(err){
            error(err)
        })
    })

    $("#closeVoto").on("click", function(){
        $("#modalVoto").hide()
        window.location.href="home.html"
    })

    $("#emailButton").on("click", function(){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($("#emailInput").val()))
        {
            $("#emailButton").text("")
            $("#emailButton").append("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span><span class='sr-only'>Loading...</span>")
            let sendMail= sendRequestNoCallback("/api/sendVoteMail","GET", {_idVoto:votoId._id, email:$("#emailInput").val()});
            sendMail.fail(function(err){
                alert("something went wrong");
            })            
            setTimeout(function(){
                $("#emailButton").text("")
                $("#emailButton").append("<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-check2-all' viewBox='0 0 16 16'><path d='M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z'/><path d='m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z'/></svg>")
            }, 2000)
        }
        else
            alert("Email non valida")
       
    })

});