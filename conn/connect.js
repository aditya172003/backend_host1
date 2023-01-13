
const dotenv=require("dotenv");
dotenv.config();
const mongoose =require("mongoose");
const { db } = require("../schema/addToCart");


// connections with mongodb atlas   
const Db=process.env.DATABASE;


mongoose.connect(Db,{}).then(()=>{
    console.log("Conection has been done successfully with mongoDB Atlas database.");
}).catch((err)=>{
    console.log("unable to connect error is :",err);
})
