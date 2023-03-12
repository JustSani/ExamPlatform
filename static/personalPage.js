"use strict"

$(() =>{

    
    $("#btnLogout").on("click", function(){
        localStorage.removeItem("token")
        
        window.location.href="login.html";
    })
    $("#startTest").on("click", function(){
        window.location.href="index.html";
    })
})