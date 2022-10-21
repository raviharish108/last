var express = require("express");
var path    = require("path");
var MongoClient =require ('mongodb').MongoClient;
var bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
require('dotenv').config()
dotenc.config()
const app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
const PORT=3000;
const MONGO_URL=process.env.URL;
async function createconnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("mongo is connected");
    return client;
}
const  client =  createconnection();
async function generatehash(password){
    const NO_OF_ROUNDS=10 ;
    const salt= await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedpassword = await bcrypt.hash(password,salt);
      console.log(salt) ;
      console.log(hashedpassword) ;
      return hashedpassword;
    }
 const noteschema={
    name:String,
    dob:String,
    age:Number,
    sex:String,
    contact:Number,
    password:String
 }
 const Note=mongodb.model("Note",noteschema);
app.get('/login', function(req, res){
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = 'login.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

app.get('/registration', function(req, res){
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = 'registration.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});
app.get('/profile', function(req, res){
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = 'profile.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});
app.post('/registration',async function(req,res){
    let newnote={
        name:req.body.name,
         password:req.body.password,
         dob:req.body.dob,
         age:req.body.age,
         sex:req.body.sex,
         contact:req.body.contact,
    }
   
    const user= await client
    .db("mongodb")
    .collection("members")
    .findOne({name:name})
    if(user){
        res.send("this name already exist")
    }else{
        try{
        const hashedpassword= await generatehash(password);
        const result= await client
        .db("mongodb")
        .collection("members")
        .insertOne({name:name,password:hashedpassword,dob:dob,age:age,sex:sex,contact:contact});
        res.redirect('/login')
        console.log(result);

    }catch{
        res.redirect('/registration')
    }
}
   
    
})
app.post('/login',async function(req,res){
    const{name,password}=req.body;
    const user = await client 
    .db("mongodb")
    .collection("members")
    .findOne({name:name});
    if(!user){
        res.send("username or password wrong")
    }else{
        const storedpassword=user.password;
        const passwordmatch=await bcrypt.compare(password,storedpassword)
        console.log(passwordmatch);
        if(passwordmatch){
            res.send("successfull login")
        }else{
            res.status(401).send({message:"invalid credentials"})
        }
    }
})
app.listen(PORT,(()=>{
    console.log("port connected")
}))