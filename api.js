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
    console.log("Ok")
    res.end("Ok")
})


module.exports = router;