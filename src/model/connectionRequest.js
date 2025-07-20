const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema(
    {
        formUserId:{
            type:mongoose.Schema.Types.ObjectId,
             ref:"User",  // refrence  to the user collection
            required:true,
           
        },

        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        status:{
            type:String,
            required:true,

            enum:{
                values:["ignore","intrested","accepted","rejected"],
                message:`{VALUES} is inccorect status `
            },
        },
        
    },
    {
        timestamps:true,
    }
);

   connectionRequestSchema.index({formUserId:1,toUserId:1});
   connectionRequestSchema.pre("save",function(next){
       const connctionRequest=this;
      if(connctionRequest.formUserId.equals(connctionRequest.toUserId)){
        throw new Error("you Can not send connection request yourself");
      }
      next();
   })

// create model

const ConnectionRequestModel=new mongoose.model("ConnectionRequestModel", connectionRequestSchema);

// expport model
module.exports=ConnectionRequestModel;


