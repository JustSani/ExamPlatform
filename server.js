"use strict"


const HTTPS = require('https');
const fs = require('fs');

const express = require("express");
const app = express();

const mongoFunctions = require('./js/mongoFunctions')
// Online RSA Key Generator
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const credentials = {"key":privateKey, "cert":certificate};

const TIMEOUT = 1000;
let port = 8888;

var httpsServer = HTTPS.createServer(credentials, app);
httpsServer.listen(port, '127.0.0.1', function() {
    console.log("Server running on port %s...",port);
});


//aggiunta middleware
var middleware = require("./middleware")
app.use("/", middleware)

//aggiunta api
var api = require('./api');
const { token } = require('./js/tokenAdministration');
const tokenAdministration = require('./js/tokenAdministration');
app.use("/api", api)



app.get("/debug/add-domande", function(req,res){
    
    mongoFunctions.insertMany(res, "domande", [
        {
            "domanda" : "Definizione di processo :",
            "risposte": 
            [
            {"A" : "Istanza di un programma in esecuzione all'interno della CPU su un certo insieme di dati"},
            {"B" : "Istanza di un programma caricato in memoria centrale ed in esecuzione su un certo insieme di dati"},
            {"C" :"Istanza di un programma su Disco Fisso con associato un certo insieme di dati"},
            {"D" : "Istanza di un programma su Disco Fisso con associati tutti i file di un certo formato"},
            {"E" : "Sinonimo di programma"}],
            "correct" : "B"
       },
       {
            "domanda" : "Il sistema operativo :",
            "risposte": [
            {"A": "e' un insieme di driver mirati alla gestione delle risorse presenti in un Personal Computer"},
            {"B": "e' un software di base mirato alla gestione delle risorse presenti in un Personal Computer"},
            {"C": "e' un software applicativo mirato alla gestione delle risorse presenti in un Personal Computer"},
            {"D": "e' un software di base che ha come obiettivo primario la velocita' di esecuzione delle applicazioni"},
            {"E": "e' un software applicativo che ha come obiettivo primario la velocita' di esecuzione delle applicazioni"}],
            "correct" : "B"
       },
       {
            "domanda" : "che cosa si intende con il termine SHELL ?",
            "risposte": [
            {"A": "Il componente piu' interno del SO, che si occupa di gestire l'esecuzione dei processi"},
            {"B": "Il componente piu' esterno del SO, che si occupa di gestire l'esecuzione dei processi"},
            {"C": "Il componente piu' interno del SO, che si occupa della gestione degli accessi alla memoria"},
            {"D": "Il componente piu' esterno del SO, che si occupa della gestione degli accessi alla memoria"},
            {"E": "Il componente piu' interno del SO, che si occupa di interpretare i comandi utente"},
            {"F": "Il componente piu' esterno del SO, che si occupa di interpretare i comandi utente"}],
            "correct" : "F"
       },
       {
            "domanda" : "Quale dei seguenti acronimi rappresenta un tipo di SHELL ?",
            "risposte": [
            {"A": "UID"},
            {"B": "CHS"},
            {"C": "LBA"},
            {"D": "CLI"},
            {"E": "RRI"},
            {"F": "VBR"}],
            "correct" : "D"
       },
       {
            "domanda" : "Che cosa si intende con il termine Device Driver ?",
            "risposte": [
            {"A": "un generico dispositivo esterno"},
            {"B": "La scheda di controllo di un dispositivo"},
            {"C": "Il software di controllo di un dispositivo"},
            {"D": "L'applicazione che utilizza un certo dispositivo "},
            {"E": "Una tecnica di accesso al dispositivo tramite bus di IO"},
            {"F": "Una tecnica di accesso al dispositivo tramite BIOS"}],
            "correct" : "C"
       },
       {
            "domanda" : "Che cosa si intende per portabilita' di una applicazione ?" ,
            "risposte": [
            {"A": "una applicazione portabile su qualunque supporto magnetico"},
            {"B": "una applicazione che puo' essere eseguita indipendentemente dal Supporto Hardware"},
            {"C": "una applicazione che puo' essere eseguita indipendentemente dal Sistema Operativo installato"},
            {"D": "una applicazione compilabile ed eseguibile indipendentemente dall'ambiente di sviluppo"},
            {"E": "una applicazione compilabile ed eseguibile indipendentemente dal tipo di compilatore utilizzato"},
            {"F": "una applicazione compilabile ed eseguibile indipendentemente dalle piattaforme hw e sw sottostanti"}],
            "correct" : "F"
       },
       {
            "domanda" : "Quale di queste caratteristiche di una applicazione e' garantita dal Sistema Operativo ? ",
            "risposte": [
            {"A": "La possibilita' di eseguire una applicazione indipendentemente dal Supporto Hardware sottostante"},
            {"B": "La possibilita' di eseguire una applicazione indipendentemente dalla piattaforma software sottostante"},
            {"C": "La possibilita' di eseguire una applicazione indipendentemente dal tipo di compilatore utilizzato"},
            {"D": "La possibilita' di compilare una applicazione mediante qualsiasi compilatore"},
            {"E": "La possibilita' di compilare una applicazione mediante qualsiasi ambiente di sviluppo"},
            {"F": "La possibilita' di compilare una applicazione indipendentemente dal linguaggio utilizzato per la sua scrittura"}],
            "correct" : "A"
       },
       {
            "domanda" : "Un sistema Dedicato e' un sistema in cui:",
            "risposte": [
            {"A": "un solo processo per volta viene eseguito fino alla sua terminazione"},
            {"B": "un solo processo per volta puo' eseguire operazioni di IO"},
            {"C": "un solo processo per volta viene trasformato in job"},
            {"D": "un solo Sistema Operativo e' presente sulla macchina"},
            {"E": "un solo processo per volta puo' essere compilato e linkato"}],
            "correct" : "A"
       },
       {
            "domanda" : "I sistemi Batch sequenziali sono sistemi in cui :",
            "risposte": [
            {"A": "job appartenenti ad utenti diversi vengono eseguiti alternativamente con cadenze temporali ben precise"},
            {"B": "job appartenenti ad utenti diversi vengono eseguiti in sequenza ognuno fino alla propria terminazione"},
            {"C": "job appartenenti ad utenti diversi rimangono in esecuzione fino a quando non devono eseguire una operazione di IO"},
            {"D": "job appartenenti ad utenti diversi vengono eseguiti in real time "},
            {"E": "piu' programmi possono accedere sequenzialmente alla stessa risorsa"},
            {"F": "piu' job possono accedere sequenzialmente alla CPU "}],
            "correct" : "B"
       },
       {
            "domanda" : "I sistemi Batch multiprogrammati sono sistemi in cui :",
            "risposte": [
            {"A": "job appartenenti ad utenti diversi vengono eseguiti alternativamente mediante una ben precisa cadenza temporale"},
            {"B": "job appartenenti ad utenti diversi vengono eseguiti in sequenza ognuno fino alla propria terminazione"},
            {"C": "job appartenenti ad utenti diversi rimangono in esecuzione fino a quando non devono eseguire una operazione di IO"},
            {"D": "job appartenenti ad utenti diversi vengono eseguiti in real time "},
            {"E": "piu' programmi possono accedere in contemporanea alla stessa risorsa"},
            {"F": "piu' job possono accedere in contemporanea alla CPU "}],
            "correct" : "C"
       }
    ])
})

app.get("/debug/add-users", function(req,res){
    mongoFunctions.insertMany(res, "users", [{
        "_id" : 1,
        "user" : "user",
        "pwd" : "pwd"
    },
    {
        "_id" : 2,
        "user" : "gianni",
        "pwd" : "ottimista"
    },
    {
        "_id" : 3,
        "user" : "stella",
        "pwd" : "bella"
    },
    {
        "_id" : 4,
        "user" : "gino",
        "pwd" : "latino"
    }])
})




/* ************************************************************* */
function error(req, res, err) {
    res.status(err.code).send(err.message);
}

// default route finale
app.use('/', function(req, res, next) {
    res.status(404)
    fs.readFile("./static/error.html", function(err, content) {
        if (err)
            content = "<h1>Risorsa non trovata</h1>" +
                "<h2><a href='/'>Back to Home</a></h2>"
        let pageNotFound = content.toString();
        res.send(pageNotFound);
    });
});