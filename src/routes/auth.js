const express=require("express");
const {validateSignupData}=require("../utlis/validation");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../model/user");
const authRouter=express.Router();

const multer=require("multer")
 // basic memory storage (you can later add file saving logic)

const upload = multer({ dest: "uploads/" }); // store file temporarily in uploads folder

authRouter.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      skills,
      about,
    } = req.body;

    console.log("Request body:", req.body);
    console.log("File:", req.file); // multer stores file here

    // encrypt password
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      gender,
      skills,
      about,
      profileImage: req.file?.filename || null, // or save req.file.path if needed
    });

    await user.save();
    res.send({ message: "Signup successful", data: user });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});


authRouter.post("/login",async(req,res)=>{
try{
const{emailId,password}=req.body;

const user=await User.findOne({emailId:emailId});
 //res.cookie("token", "abc123"); 
if(!user){
  throw new Error("please check either email or password");
}

// const isPasswordMatch=await user.validatePassword(password);


const isPasswordMatch=await bcrypt.compare(password,user.password);

if(isPasswordMatch){
  const token=await jwt.sign({_id:user._id},"Rayees@3457",
    {
      expiresIn:"2d"
    }
  ) 
  // console.log(token);
 res.cookie("token", token, {
  httpOnly: true,
  secure: true,           // ✅ required on HTTPS (production)
  sameSite: "None",       // ✅ allow cross-origin cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
 console.log("Cookies:", req.cookies);
  res.send(user);
}
else{
  throw new Error(" password problem")
}

}
catch(err){
 res.status(400).send("Error: "+err.message);
}
})

authRouter.post("/logout",async(req,res)=>{
  res.cookie("token",null,{
    expires: new Date(Date.now()),
  }) 
  
  res.send("user Logout Sucessfully");
})



module.exports=authRouter;
