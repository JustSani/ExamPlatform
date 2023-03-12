var express = require('express')
router = express.Router()

const mongoFunctions=require("./js/mongoFunctions");
const tokenAdministration=require("./js/tokenAdministration");


router.get("/user", function (req, res){
    tokenAdministration.ctrlTokenLocalStorage(req, function(payload){
        console.log(payload)
        mongoFunctions.find(res, "users", {_id:payload._id}, {pwd:0})
    })
});

router.get("/elencoDomande", function (req,res){
    mongoFunctions.find(res, "domande",{},{correct:0})    
});

router.post("/login",function (req,res){
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

router.post("/sendRisposte", function(req, res){
    console.log(req.body)
    console.log("Ok")
    res.end("Ok")
})


module.exports = router;