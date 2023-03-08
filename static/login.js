"use strict";

$(()=>{
    $("#btnLogin").on("click",function (){
        let loginReq=sendRequestNoCallback("/api/login","POST",{username:$("input[name=username]").val(),pwd:$("input[name=password]").val()});
        loginReq.fail(function (jqXHR){
            $(".msg").html("Error login: " + jqXHR.status + " - " + jqXHR.responseText);
        });
        loginReq.done(function (serverData){
            serverData=JSON.parse(serverData);
            localStorage.setItem("token",serverData.token);
            window.location.href="index.html";
        });
    });
});