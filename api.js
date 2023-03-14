var express = require('express')
router = express.Router()

const mongoFunctions=require("./js/mongoFunctions");
const { token } = require('./js/tokenAdministration');
const tokenAdministration=require("./js/tokenAdministration");
const {ObjectId} = require('mongodb');

router.get("/user", function (req, res){
    tokenAdministration.ctrlTokenLocalStorage(req, function(payload){
        console.log(payload)
        mongoFunctions.find(res, "users", {_id:payload._id}, {pwd:0})
    })
});
router.get("/elencoVoti", function(req,res){
    
    res.end("palel")
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

router.post("/sendRisposte", function(req, res){
    console.log(req.body)
    let idTest = req.body["_id"]
    let answers = req.body["answers"]
    idTest = new ObjectId(idTest)
    mongoFunctions.find2(res, "esami", {_id:idTest}, {}, function(quer){
        let punteggio = 0;
        console.log("length" + quer[0].domande.length)
        for(let j = 0; j <quer[0].domande.length; j++){
            let q = quer[0].domande[j]
            console.log("id" + q)
            console.log(j)
            mongoFunctions.find2(res, "domande", {_id: q}, {}, function(quer2){
                console.log(quer2[0].correct)
                console.log(answers["ANS" + j])
                if(answers["ANS" + j] && answers["ANS" + j] == quer2[0].correct)
                {
                    console.log("CORRETTA: +1")
                    punteggio += 1
                }    
                else if(answers["ANS" + j] && answers["ANS + j"] != quer2[0].correct) {
                    console.log("ERRATA" )
                    //punteggio -= 0.25
                }
                else{
                    console.log("nON DATA")
                }

                if(quer[0].domande.length == j +1 )
                {
                    console.log("Voto finale:" + punteggio)
                    
                    tokenAdministration.ctrlTokenLocalStorage(req, function(payload){
                        let idUser = new Object(payload._id)
                        let obj = {
                            _idUser : idUser,
                            giuste: punteggio ,
                            totale: j + 1,
                            _idEsame: idTest,
                            risposte: answers
                        }
                        mongoFunctions.insertOne(res, "voti", obj)
                    } )
                }
                    
                
            })
        }

    })
})


module.exports = router;