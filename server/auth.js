const express=require("express")
const router=express.Router();

const jwt=require("jsonwebtoken")

const cookieparser = require('cookie-parser')

const app =express();

let cors = require("cors");
app.use(cors(
   {
      origin:"http://localhost:3000",
      credentials: true,
     headers:"Content-type",
      // methods:"GET ,POST ,PUT",
      optionSuccessStatus:200
   }
))

app.use(cookieparser());
//hashing password 
const bcrypt=require("bcrypt")

// collection imported
const User=require("../schema/userschema");
const Mycart=require('../schema/addToCart');
const Authentication = require("../MiddleWare/middleware");
// conntection with database and saaving it in database
require("../conn/connect");


router.get("/",(req,res)=>{
    res.send("this is from sever folder with router of express");   
})



router.get("/info",(req,res)=>{
   res.send("trial changes in the  new router successfully fetched ");   
})


// router.post("/register", (req,res)=>{
//     console.log(req.body.name);
//    const {name,email,phone,work,password,cpassword}=req.body;
//    if(!name ||!email||!phone||!work||!password||!cpassword){
//     res.status(422).json({message:"please enter valid data"});

//    }else{

//     User.findOne({email:email}).then((userExist)=>{
//         if(userExist){
//         res.json({error:"email already exist"})
//     }
//     const user=new User ({name,email,phone,work,password,cpassword});
//     user.save().then(()=>{
//         res.status(201).json({message:"data successfully stored in Atlas Database"});
//     }).catch((err)=>{
//         res.status(501).json({error:"unable to save"})
//     })
//     }).catch((err)=>{
//         console.log(err);
        
//         res.status(501).json({error:"unable to save"})
//     })

//    }
// })



// regestration page router ...............................................................................1] registretion router 

// url to request  for regitration is register

router.post("/regi",async(req,res)=>{
    console.log(req.body);
   const {name,email,phone,work,password,cpassword}=req.body;
   
   if(!name ||!email||!phone||!work||!password||!cpassword){
   return res.status(422).json({message:"please enter valid data"});

   }else if(cpassword!=password){
    return res.status(401)
   }
   
   else{
    const ex = await User.findOne({email:email})
    if(ex){
       return res.status(200).json({error:"email already exist"})
    }else{
        const user=new User ({name,email,phone,work,password,cpassword});

        const saved= await user.save();
      
       return (saved)?res.status(201).json({message:"data successfully stored in Atlas Database"}):res.status(501).json({error:"unable to save"});
      
    }
     
    

   }
})




// login router .................................................................................................2] login router 


router.post("/log",async(req,res)=>{
   try{ 
      console.log("user wants to login")
     
    const {email ,password}=req.body;

    if(!email||!password){
        res.status(422).json({error:"enter the required data first"})
    }else{
         const us=await User.findOne({email})
         if(us){
            //checking password this is hashed password so  this is compared like this using bcrypt 
            const isMatch=await bcrypt.compare(password,us.password)
            const token=await us.generateAuthToken() 

           // console token during login 
           console.log("1 ] console token during login")
             console.log(token)
    
            res.cookie("jwtoken",token,{
              
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            }); 
             
              
          (isMatch)? res.status(200).send({
           
            message:"login success" 
          }):res.send({message:"unable to login"})
        
            
         }else{
            res.status(404).json({error:"user not found please register first"})
         }
    }

   }catch(err){
    console.log(err)
   }
})


// removed middle woare , Authentication
router.get("/ab",Authentication,(req,res)=>{
   // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   // res.header("Access-Control-Allow-Credentials", "true");
   //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   console.log("request reached ")
      res.send(req.rootuser)
      console.log(req.rootuser);
})




// add to cart router .........................................................................................3] add to cart router

// here just we have to add middlewere of authentication 

router.post("/cart",async (req,res)=>{
   console.log(req.body);
   const {userId,eventId,transactionId,totalPrice}=req.body

   if(!userId||!eventId||!totalPrice){
     return res.status(422).json({error:"data is missing"})
   }
   else{
   const cart_exist=await Mycart.findOne({userId,eventId});

   if(cart_exist){
    return  res.status(200).json({message:"already added to cart"})

   }
   else{
      const mycart =new Mycart ({userId,eventId,totalPrice,transactionId:"NULL"})

      const save=await mycart.save();

      if(save){
      return   res.status(200).json({message:"cart added successfully"})
      }else{
         res.status(404).json({error:"internal server error"})
      }

   }
   }
})


// updating transaction id 
// perfectly updating transaction id all

router.patch("/addtrans",async(req,res)=>{
   console.log(req.body)
   
   const {userId ,transactionId}=req.body

   if(!userId|!transactionId){
      return res.status(422).json({error:"chack payment "})

   }else{
      const user=Mycart.findOne({userId})
      if(user){
       const re=await  user.updateMany({transactionId:transactionId})
          if(re){
            return res.status(200).json({message:"transaction id updated successfully"})


          }
          else{
           return res.status(404).json({error:"internal server error"})
          }
      }else{
        return res.status(404).json({message:"your cart is empty"})
      }

   }

})


// adding transaction id after payment 
//  here i will have to find multiple as one user can have multiple  events in cart 

// here i am able to find multiple and it is working for more search  and deleting also
router.post("/paytrans",async(req,res)=>{
   console.log(req.body)

   const {userId,transactionId}=req.body

   if(!userId|!transactionId){
      res.status(422).json({message:"invalid data"})

   }
   else{
      
      const user =await Mycart.findOne({userId ,transactionId});
      if(user){
         if(user.transactionId==transactionId){
            const del =await Mycart.deleteMany({userId,transactionId})
            if(del){
               return   res.status(200).json({message:"cart deleted "})
            }else{
               return  res.status(404).json({error:"internal server error"})
            }
          
         }else{
           return  res.status(422).json({error:"check payment transaction id "})
         }
      

      }
      else{
        return  res.status(404).json({error:"internal server error"})
      }
      


   }
})












































module.exports=router;

