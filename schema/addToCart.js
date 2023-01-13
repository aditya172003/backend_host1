const mongoose=require("mongoose")




const cart=new mongoose.Schema({
    userId:{
        type:Number,
        require:true
    },
    eventId:{
        type :Number,
        require :true
    }
    ,
    transactionId:{
        type :String,
        

    },
    totalPrice:{
       type :String,
       require:true
    }


})



const Mycart=mongoose.model("MYCART",cart);

module.exports=Mycart