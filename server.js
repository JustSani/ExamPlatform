"use strict"
const mongoFunctions=require("./js/mongoFunctions");
const tokenAdministration=require("./js/tokenAdministration");
const fs = require('fs');
const HTTPS = require('https');

const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
//const bcrypt = require("bcrypt");

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

// middleware
app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", function(req, res, next) {
    console.log(">_ " + req.method + ": " + req.originalUrl);
    if (Object.keys(req.query).length != 0)
        console.log("Parametri GET: " + JSON.stringify(req.query));
    if (Object.keys(req.body).length != 0)
        console.log("Parametri BODY: " + JSON.stringify(req.body));
    next();
});

app.use("/", express.static('./static'));

app.get("/api/elencoDomande", function (req,res){
    tokenAdministration.ctrlTokenLocalStorage(req,function (payload){
        if(!payload.err_exp){   // Token OK
            // query per prelevare le domande

        }else{  // Token inesistente o scaduto
            console.log(payload.message);
            error(req,res,{code:403,message:payload.message});
        }
    });
});

app.post("/api/login",function (req,res){
    let params = req.body;
    console.log(params)
    mongoFunctions.find2(res, "users", {user:params["username"], pwd:params["pwd"]}, {}, function(resp){
        console.log(resp)
        if(resp.length != 0){ 
            tokenAdministration.createToken(resp);
            res.send({msg:"Login OK",token:tokenAdministration.token});
        }else
        error(req,res,{code:-1,message:"Password o email erratta"});
    });

    
});

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

app.get("/debug/add-domande", function(req,res){
    mongoFunctions.insertMany(res, "domande", [
        {
            "domanda" : "Definizione di processo :",
            "risposte": ["Istanza di un programma in esecuzione all'interno della CPU su un certo insieme di dati",
            "Istanza di un programma caricato in memoria centrale ed in esecuzione su un certo insieme di dati",
            "Istanza di un programma su Disco Fisso con associato un certo insieme di dati",
            "Istanza di un programma su Disco Fisso con associati tutti i file di un certo formato",
            "Sinonimo di programma"],
            "correct" : 1
       },
       {
            "domanda" : "Il sistema operativo :",
            "risposte": ["e' un insieme di driver mirati alla gestione delle risorse presenti in un Personal Computer",
            "e' un software di base mirato alla gestione delle risorse presenti in un Personal Computer",
            "e' un software applicativo mirato alla gestione delle risorse presenti in un Personal Computer",
            "e' un software di base che ha come obiettivo primario la velocita' di esecuzione delle applicazioni",
            "e' un software applicativo che ha come obiettivo primario la velocita' di esecuzione delle applicazioni"],
            "correct" : 1
       },
       {
            "domanda" : "che cosa si intende con il termine SHELL ?",
            "risposte": ["Il componente piu' interno del SO, che si occupa di gestire l'esecuzione dei processi",
            "Il componente piu' esterno del SO, che si occupa di gestire l'esecuzione dei processi",
            "Il componente piu' interno del SO, che si occupa della gestione degli accessi alla memoria",
            "Il componente piu' esterno del SO, che si occupa della gestione degli accessi alla memoria",
            "Il componente piu' interno del SO, che si occupa di interpretare i comandi utente",
            "Il componente piu' esterno del SO, che si occupa di interpretare i comandi utente"],
            "correct" : 5
       },
       {
            "domanda" : "Quale dei seguenti acronimi rappresenta un tipo di SHELL ?",
            "risposte": ["UID",
            "CHS",
            "LBA",
            "CLI",
            "RRI",
            "VBR"],
            "correct" : 3
       },
       {
            "domanda" : "Che cosa si intende con il termine Device Driver ?",
            "risposte": ["un generico dispositivo esterno",
            "La scheda di controllo di un dispositivo",
            "Il software di controllo di un dispositivo",
            "L'applicazione che utilizza un certo dispositivo ",
            "Una tecnica di accesso al dispositivo tramite bus di IO",
            "Una tecnica di accesso al dispositivo tramite BIOS"],
            "correct" : 2
       },
       {
            "domanda" : "Che cosa si intende per portabilita' di una applicazione ?" ,
            "risposte": ["una applicazione portabile su qualunque supporto magnetico",
            "una applicazione che puo' essere eseguita indipendentemente dal Supporto Hardware",
            "una applicazione che puo' essere eseguita indipendentemente dal Sistema Operativo installato",
            "una applicazione compilabile ed eseguibile indipendentemente dall'ambiente di sviluppo",
            "una applicazione compilabile ed eseguibile indipendentemente dal tipo di compilatore utilizzato",
            "una applicazione compilabile ed eseguibile indipendentemente dalle piattaforme hw e sw sottostanti"],
            "correct" : 5
       },
       {
            "domanda" : "Quale di queste caratteristiche di una applicazione e' garantita dal Sistema Operativo ? ",
            "risposte": ["La possibilita' di eseguire una applicazione indipendentemente dal Supporto Hardware sottostante",
            "La possibilita' di eseguire una applicazione indipendentemente dalla piattaforma software sottostante",
            "La possibilita' di eseguire una applicazione indipendentemente dal tipo di compilatore utilizzato",
            "La possibilita' di compilare una applicazione mediante qualsiasi compilatore",
            "La possibilita' di compilare una applicazione mediante qualsiasi ambiente di sviluppo",
            "La possibilita' di compilare una applicazione indipendentemente dal linguaggio utilizzato per la sua scrittura"],
            "correct" : 0
       },
       {
            "domanda" : "Un sistema Dedicato e' un sistema in cui:",
            "risposte": ["un solo processo per volta viene eseguito fino alla sua terminazione",
            "un solo processo per volta puo' eseguire operazioni di IO",
            "un solo processo per volta viene trasformato in job",
            "un solo Sistema Operativo e' presente sulla macchina",
            "un solo processo per volta puo' essere compilato e linkato"],
            "correct" : 0
       },
       {
            "domanda" : "I sistemi Batch sequenziali sono sistemi in cui :",
            "risposte": ["job appartenenti ad utenti diversi vengono eseguiti alternativamente con cadenze temporali ben precise",
            "job appartenenti ad utenti diversi vengono eseguiti in sequenza ognuno fino alla propria terminazione",
            "job appartenenti ad utenti diversi rimangono in esecuzione fino a quando non devono eseguire una operazione di IO",
            "job appartenenti ad utenti diversi vengono eseguiti in real time ",
            "piu' programmi possono accedere sequenzialmente alla stessa risorsa",
            "piu' job possono accedere sequenzialmente alla CPU "],
            "correct" : 1
       },
       {
            "domanda" : "I sistemi Batch multiprogrammati sono sistemi in cui :",
            "risposte": ["job appartenenti ad utenti diversi vengono eseguiti alternativamente mediante una ben precisa cadenza temporale",
            "job appartenenti ad utenti diversi vengono eseguiti in sequenza ognuno fino alla propria terminazione",
            "job appartenenti ad utenti diversi rimangono in esecuzione fino a quando non devono eseguire una operazione di IO",
            "job appartenenti ad utenti diversi vengono eseguiti in real time ",
            "piu' programmi possono accedere in contemporanea alla stessa risorsa",
            "piu' job possono accedere in contemporanea alla CPU "],
            "correct" : 2
       }
    ])
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