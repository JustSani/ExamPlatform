var express = require('express')
var router = express.Router();
const bodyParser = require('body-parser');
const tokenAdministration = require("./js/tokenAdministration");
const cors = require('cors');

const fs = require('fs');
const { get } = require('http');
// middleware
router.use("/", bodyParser.json());
router.use("/", bodyParser.urlencoded({ extended: true }));
router.use(cors());

router.use("/", function(req, res, next) {
    if(req.originalUrl.includes("api")  || req.originalUrl.includes("index")  ){
        console.log(">_ " + req.method + ": " + req.originalUrl);
        if (Object.keys(req.query).length != 0)
            console.log("Parametri GET: " + JSON.stringify(req.query));
        if (Object.keys(req.body).length != 0)
            console.log("Parametri BODY: " + JSON.stringify(req.body));
    }
        next();

});

router.use("/", express.static('./static'));

//middleware che controlla il token a tutte le route eccetto a quella dell login
router.use("/", function(req,res,next){
    if(req.originalUrl.includes("/api") && !req.originalUrl.includes("/login")){
        tokenAdministration.ctrlTokenLocalStorage(req,function (payload){
            if(!payload.err_exp){   // Token OK
                //console.log("this mf has a token")
                next()
            }else{  // Token inesistente o scaduto
                console.log(payload.message);
                error(req,res,{code:403,message:payload.message});
            }
        })
    }
    else
        next()
    
})
router.get("/", function(req,res){
    getFile("./static/html/index.html",res)
})

router.use("/",function(req,res,next){
    if(req.originalUrl.includes("login.html"))
        getFile("./static/html/login.html", res)
    else if(req.originalUrl.includes("index.html"))
        getFile("./static/html/index.html", res)
    else if(req.originalUrl.includes("personalPage.html"))
        getFile("./static/html/personalPage.html", res)
    else if(req.originalUrl.includes("storicoVerifiche.html"))
        getFile("./static/html/storicoVerifiche.html", res)
    else
        next()
})

function getFile(url, res){
    fs.readFile(url, function(err, content) {
        if (err)
            content = "<h1>Risorsa non trovata</h1>" +
                "<h2><a href='/'>Back to Home</a></h2>"
        let pageNotFound = content.toString();
        res.send(pageNotFound);
    });
}


module.exports = router;