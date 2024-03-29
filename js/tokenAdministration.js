const jwt=require("jsonwebtoken");
const fs=require("fs");

let tokenAdministration=function (){
    this.payload="";
    this.token="";
    this.valoreCookie="";
    this.privateKey=fs.readFileSync("keys/private.key","UTF8");
}

tokenAdministration.prototype.ctrlTokenLocalStorage = function (req,callback){
    const token = req.headers["token"].split(' ')[1];
    //console.log(token)
    if(token != "null"){
        console.log("ctrlTokenLocalStorage token not null");
        jwt.verify(token,this.privateKey,function (err,data){
            if(!err)
                this.payload = data;
            else
                this.payload = {err_exp:true, message:"Token scaduto o corrotto"};
            callback(this.payload);
        });
    }else{
        this.payload = {err_exp:true, message:"Token inesistente"};
        callback(this.payload);
    }
}

tokenAdministration.prototype.ctrlToken = function (req,callback){
    this.payload="";
    this.token=this.readCookie(req,"token");
    let errToken={codErr:-1,message:""};
    if(this.token=="")
        errToken={codErr: 403,message: "Token inesistente"};
    else{
        try{
            this.payload=jwt.verify(this.token, this.privateKey);
            console.log("Token OK!");
        }catch(err) {
            errToken = {codErr: 403, message: "Token scaduto o compromesso"};
        }
    }
    callback(errToken);
}

tokenAdministration.prototype.createToken = function (user){
    this.token=jwt.sign({
        "_id":user[0]._id,
        "user":user[0].user,
        "data":user[0].data,
        "citta":user[0].citta,
        "nome":user[0].nome,
        "cognome":user[0].cognome,
        "exp":Math.floor(Date.now()/1000 + 60 * 60 * 24)
    },this.privateKey);
    
}

tokenAdministration.prototype.readCookie = function (req,nome){
    this.valoreCookie="";
    if(req.headers.cookie){
        let cookies=req.headers.cookie.split("; ");
        for(let i=0;i<cookies.length;i++){
            cookies[i]=cookies[i].split("=");
            if(cookies[i][0]==nome){
                this.valoreCookie=cookies[i][1];
                break;
            }
        }
    }
    return this.valoreCookie;
}

module.exports = new tokenAdministration();
