const mongoose=require("mongoose");

const URI="mongodb+srv://rayees6203:JDCukcoH2DSsdPet@cluster0.m0suibg.mongodb.net/devTinder"

const connectDB=async()=>{
    await mongoose.connect(URI);
}

module.exports=connectDB;