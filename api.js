var express = require('express')
router = express.Router()

const nodemailer=require("nodemailer");
const mongoFunctions=require("./js/mongoFunctions");
const { token, payload } = require('./js/tokenAdministration');
const tokenAdministration=require("./js/tokenAdministration");
const {ObjectId} = require('mongodb');

router.get("/user", function (req, res){
    tokenAdministration.ctrlTokenLocalStorage(req, function(payload){
        console.log(payload)
        mongoFunctions.find(res, "users", {_id:payload._id}, {pwd:0})
    })
});
router.get("/elencoVoti", function(req,res){
    tokenAdministration.ctrlTokenLocalStorage(req, function(payload){
        mongoFunctions.find(res, "voti", {_idUser: payload._id}, {})
    })
})

router.get("/elencoEsami", function(req, res){
    mongoFunctions.find(res, "esami", {}, {})
})


router.get("/getDomande", function (req,res){
    let id = new ObjectId(req.query["id"])  
    mongoFunctions.find2(res, "esami",{_id:id},{}, function(ris){
        console.log("---------")
        console.log(ris[0].domande)
        let domande = ris[0].domande
        let domandeEsame = []
        for(let i = 0; i < domande.length; i++){
            let ap =domande[i] 
            console.log(domande[i])
            mongoFunctions.find2(res, "domande", {_id:ap},{correct:0}, function(ris2){
                console.log(ris2)
                domandeEsame.push(ris2)
                
                if(i == domande.length -1)
                    res.end(JSON.stringify(domandeEsame))

                console.log(domandeEsame)  
            })
        };

        //for(let i = 0; i < ris.)
        //mongoFunctions.find(res, "domande", {id}, {})
    })    
});

router.post("/login",function (req,res){
    let params = req.body;
    console.log(params)
    mongoFunctions.find2(res, "users", {user:params["username"], pwd:params["pwd"]}, {}, function(resp){
        console.log(resp)
        if(resp.length != 0){ 
            tokenAdministration.createToken(resp);
            console.log(tokenAdministration)
            res.send({msg:"Login OK",token:tokenAdministration.token});
        }else
        error(req,res,{code:-1,message:"Password o email erratta"});
    });    
});

router.get("/sendVoteMail", function(req, res){
    let email = req.query.email
    let _idVoto = new ObjectId(req.query._idVoto)
    let pwd=require("./config/passwords.js");
    mongoFunctions.find2(res, "voti", {_id:_idVoto}, {}, function(ris){
        ris = ris[0] 
        let voto = ris.giuste * 10 / ris.totale
        let transport=nodemailer.createTransport({
            service:'gmail',
                auth:{
                    user:pwd.email,
                    pass:pwd.password
                }
        });
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=0;
        let bodyHtml = "<html><body><h1>Voto</h1>" +
            "<p>Hai preso niente popodimeno che: <b>" +voto + "</b><br>" + 
            "Azzecandone ben: <b>" + ris.giuste + "</b> su ben <b>" + ris.totale + "</b> totali<br><br>per la correzione visita il registro" + 
            "<br><br>Grazie per aver sofferto con noi.<br> <small>Sanino Fabio<small></p></body></html>";
        const message={
            from:pwd.email,
            to: email,
            subject:"Voto della verifica",
            html:bodyHtml
        };
        transport.sendMail(message,function (err,info){
            if(err){
                console.log(err);
                process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=1;
                res.end("Errore di invio mail");
            }
            else{
                console.log(info);
                process.env["NODE_TLS_REJECT_UNAUTHORIZED"]=1;
                res.end(JSON.stringify(info));
                }
        });
    })
    
})

router.post("/sendRisposte", function(req, res){
    let idTest = req.body["_id"]
    let answers = req.body["answers"]
    idTest = new ObjectId(idTest)
    mongoFunctions.find2(res, "esami", {_id:idTest}, {}, function(quer){
        let punteggio = 0;
        for(let j = 0; j <quer[0].domande.length; j++){
            let q = quer[0].domande[j]
            mongoFunctions.find2(res, "domande", {_id: q}, {}, function(quer2){
                if(answers["ANS" + j] && answers["ANS" + j] == quer2[0].correct)
                {
                    console.log("CORRETTA: +1")
                    punteggio += 1
                }    
                else if(answers["ANS" + j] && answers["ANS + j"] != quer2[0].correct)
                    console.log("ERRATA" )
                else
                    console.log("nON DATA")

                if(quer[0].domande.length == j +1 )
                {
                    console.log("Voto finale:" + punteggio)
                    tokenAdministration.ctrlTokenLocalStorage(req, function(payload){
                        let idUser = payload._id
                        let ts = Date.now();

                        let date_ob = new Date(ts);
                        let date = date_ob.getDate();
                        let month = date_ob.getMonth() + 1;
                        let year = date_ob.getFullYear();
                        let today = date + "-" + month + "-" + year;
                        let obj = {
                            _idUser : idUser,
                            giuste: punteggio ,
                            totale: j + 1,
                            _idEsame: idTest,
                            risposte: answers,
                            date: today
                        }
                        mongoFunctions.insertOne2(res, "voti", obj, function(ris){
                            mongoFunctions.find(res, "voti", {_id: ris.insertedId}, {})
                        })
                    } )
                }
                    
                
            })
        }

    })
})


module.exports = router;