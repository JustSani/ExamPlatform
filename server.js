"use strict"


const HTTPS = require('https');
const fs = require('fs');

const express = require("express");
const app = express();


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
app.use("/api", api)




/* ************************************************************* */

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