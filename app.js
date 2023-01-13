
// const User=require("./schema/userschema");  // we can require i=our collectionn document using this user 
const dotenv=require("dotenv");
dotenv.config();


const jwt=require("jsonwebtoken")
const express= require("express");
const cookieparser = require('cookie-parser')

let cors = require("cors");
const app=express();


require("./conn/connect");
app.use(cookieparser())
app.use(express.json())
app.use(cors());



// requiring the router part of beckend urls where actual requests and responsese are going to happpens  ;

app.use(require("./server/auth"));



app.get("/",(req,res)=>{
    res.send("start again ")
})


const port=process.env.PORT||5000;
app.listen(port ,()=>{
   
    console.log("Server is  runnig at port number :",port)
})