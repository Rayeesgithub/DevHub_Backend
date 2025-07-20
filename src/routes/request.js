const express=require("express");
const userAuth=require("../middleware/auth")
const User=require("../model/user")
const requestRouter=express.Router();
const ConnectionRequest=require("../model/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
try{
const formUserId=req.user._id;
const toUserId=req.params.toUserId;
const status=req.params.status;

const toUser=await User.findById(toUserId);
if(!toUser){
  return res.status(400).json({
    message:"User not Found"
  })
}
const AllowedStatus=["ignore","intrested"];
if(!AllowedStatus.includes(status)){
  return res.status(400).json({
    message:"Invalid status type:"+status,
  })
}

const existingConnectionReqest=await ConnectionRequest.findOne({
  $or:[
    {formUserId,toUserId},
    {formUserId:toUserId, toUserId:formUserId}
  ]
})

if(existingConnectionReqest){
  return res.status(400).json(
    {
      message:"Conecttin request Already Exist",
    }
  )
}
const connectionRequest=new ConnectionRequest({
  formUserId,
  toUserId,
  status,

})

const data=await connectionRequest.save();

res.json({
  message:req.user.firstName + " is " + status + " in " + toUser.firstName ,
  data
})
} 
catch(err){
  res.status(400).send("Error: "+ err.message)
}
})



requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
      const loggedInUser=req.user;
  const {status,requestId}=req.params;

  console.log("requestId:", requestId);
console.log("loggedInUser._id:", loggedInUser._id);
console.log("status param:", status);

  const AllowedStatus=["accepted","rejected"];
  if(!AllowedStatus.includes(status)){
    return res.status(400).json({
      message:"Status is not allowed",
     
    })

}

const connectionRequest=await ConnectionRequest.findOne({
  
  toUserId:loggedInUser._id,
  status:"intrested",
  
})

if(!connectionRequest){
  return res.status(400).json({
    message:"Connection request is not found",
  })
}


connectionRequest.status=status;
const data= await connectionRequest.save();

  res.json({message:"Connection request" +status,
    data
  })
  
  }
  catch(err){
   res.status(400).send("Error: " + err.message);
  }

})
module.exports=requestRouter;