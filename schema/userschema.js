
const dotenv=require("dotenv");
dotenv.config();
const mongoose =require("mongoose")

const jwt=require("jsonwebtoken")
//hashing password 
const bcrypt=require("bcrypt")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    }
    ,
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }
]


})


// bcrypr=t that is hashing the password  it is a middleware which is run before save event is called    
userSchema.pre('save',async function(next){
   if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12);
        this.cpassword=await bcrypt.hash(this.cpassword,12);
        

   }
   next();
})


// generating authentication token 



userSchema.methods.generateAuthToken  = async function(){
           try{  // this sectete key we have to keep secrete in env file 
           
                  let token =jwt.sign({_id: this._id}, process.env.JWT_PASS);
                  this.tokens=this.tokens.concat({token:token});
                  await this.save();
                  return token
                  
           }catch(err){
                console.log(err);
           }
}









const User=mongoose.model('USER',userSchema);


module.exports=User;