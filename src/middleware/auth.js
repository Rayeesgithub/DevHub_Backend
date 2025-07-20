const jwt=require("jsonwebtoken");
const User=require("../model/user");

const userAuth=async(req,res,next)=>{
   try{
    const {token}=req.cookies;
    if(!token){
      return res.status(401).send("please Login");
    }

    const decodeMsg=await jwt.verify(token,"Rayees@3457");
    const{_id}=decodeMsg;

    const user=await User.findById(_id);

    if(!user){
        throw new Error("user not Found");
    }

    req.user=user;
    next();
}
catch(err){
    res.status(400).send("Error: "+ err.message);
}
}

module.exports=userAuth;