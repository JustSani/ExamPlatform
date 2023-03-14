"use strict";

const mongo=require("mongodb");
const mongoClient=mongo.MongoClient;
//const bcrypt=require("bcrypt");
const CONNECTION_STRING="mongodb://127.0.0.1:27017";
const CONNECION_OPTIONS={ useNewUrlParser:true };


// ----------------------------
// IMPOSTAZIONI PRESE DAL CONFIG
const conf = require("../config/serverConfig")
const urlServerMongoDb = conf.urlMongo;
const nomeDb = conf.database;
// ----------------------------

let obj;
let mongoFunctions = function () {}

function creaConnessione(nomeDb, res, callback){
    res.setHeader('Content-Type', 'application/json');

    console.log(mongoClient);
    let promise = mongoClient.connect(urlServerMongoDb);
    promise.then(function(connessione){
        callback(connessione, connessione.db(nomeDb))
    });
    promise.catch(function(err){
        json = {code:-1, desc:"Errore nella connessione"};
        res.end(JSON.stringify(json));
    });
}


mongoFunctions.prototype.find=function (res, col, find, select){
    creaConnessione(nomeDb, res, function(conn, db){
        let promise = db.collection(col).find(find).project(select).toArray();
        promise.then(function(ris){
            //console.log(ris);
            obj = { code:0, desc:"Dati trovati con successo", ris};
            res.end(JSON.stringify(obj));
            conn.close();
        });
        promise.catch(function(error){
            obj = { code:-2, desc:"Errore nella ricerca"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

mongoFunctions.prototype.find2=function (res, col, find, select, callback){
    creaConnessione(nomeDb, res, function(conn, db){
        let promise = db.collection(col).find(find).project(select).toArray();
        promise.then(function(ris){
            //console.log(ris);
            callback(ris)
        });
        promise.catch(function(error){
            obj = { code:-2, desc:"Errore nella ricerca"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

mongoFunctions.prototype.insertMany=function (res, col, array){
    creaConnessione(nomeDb, res, function(conn, db){
        let promise = db.collection(col).insertMany(array); 
        promise.then(function(ris){
            obj = { code:0, desc:"Insert in esecuzione", ris };
            res.end(JSON.stringify(obj));
            conn.close();
        });
        promise.catch(function(err){
            obj = { code:-2, desc:"Errore nell'inserimento"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

mongoFunctions.prototype.insertOne=function (res, col, obj){
    creaConnessione(nomeDb, res, function(conn, db){
        let promise = db.collection(col).insertOne(obj);
        promise.then(function(ris){
            obj = { code:0, desc:"Insert in esecuzione", ris };
            res.end(JSON.stringify(obj));
            conn.close();
        });
        promise.catch(function(err){
            obj = { cod:-2, desc:"Errore nell'inserimento"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}
mongoFunctions.prototype.insertOne2=function (res, col, obj, callback){
    creaConnessione(nomeDb, res, function(conn, db){
        let promise = db.collection(col).insertOne(obj);
        promise.then(function(ris){
            conn.close();
            callback(ris)
        });
        promise.catch(function(err){
            obj = { cod:-2, desc:"Errore nell'inserimento"}
            res.end(JSON.stringify(obj));
            conn.close();
        });
    });
}

module.exports = new mongoFunctions();