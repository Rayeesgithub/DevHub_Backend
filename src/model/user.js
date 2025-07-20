// Import mongoose
const mongoose = require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
// Define the schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true, // name is required
    // required:[true,'firstname is required'], // custome require
    trim: true      // removes extra spaces
  },
  lastName: {
    type: String,
    trim: true      // removes extra spaces
  },
  emailId: {
    type: String,
    required: true,
    unique: true,   // ensures no duplicate emails
    lowercase: true, // convert email to lowercase
    //  match: /.+\@.+\..+/,

    validate(value){
      if(!validator.isEmail(value)){
       throw new Error("Invalid email"+value)
      }
    }
  },
  password:{
     type: String,
    required: true,  // password is mandatory
    minlength: 6  ,   // must be at least 6 characters
    
    validate(value){
      if(!validator.isStrongPassword(value)){
       throw new Error("enter the Strong:" +value)
      }
    }
  },
//   createdAt: {
//     type: Date,
//     default: Date.now // Sets current date/time by default
// },
role: {
  type: String,
  enum: ['user', 'admin', 'superadmin','signup']
}
,
status: {
    type: String,
    default: 'active'
},
  age: {
    type: Number,
    // min: 0          // must be non-negative
    min:18,
    max:45
  },
 gender: {
  type: String,
  enum:{
    values:["male","female","others"],
    message:`{VALUE} is not valid gender type`,
  }
  // validate(value) {
  //   const allowed = ["male", "female", "others"];
  //   if (!allowed.includes(value.toLowerCase())) {
  //     throw new Error("Gender must be 'male', 'female', or 'others'");
  //   }
  // }
}
,

  skills:{
    type:[String],

  },
 
  photoUrl:{
    type:String,
    default:"https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg",

  },
  profileImage: {
  type: String,
  default: "https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg",
}
,
about:{
  type:String,
  
}
},
 {
    timestamps:true,
  }

);
// ✅ Schema Method to compare passwords
userSchema.method.validatePassword=async function(plainPassword){
  const user=this;
  const passwordHash=user.password;  // passwordHash=this.password
   isPasswordValid=await bcrypt.compare(plainPassword, passwordHash);
   return isPasswordValid;
}

userSchema.index({firstName:1,lastName:1});
// Create the model
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;

//connectionRequstModel
