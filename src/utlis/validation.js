const validator=require("validator")
const validateSignupData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;

if(!firstName || !lastName){
    throw new Error("Name is not valid");
} 
//we alredy validation at db level so we do not need this code.
// else if(firstName.length<4 || firstName.length>40){
//     throw new Error("password should be 4 to 40 charecter")
// }
else if(!validator.isEmail(emailId)){
    throw new Error("email is not valid")
}

else if(!validator.isStrongPassword(password)){
    throw new Error("please enter the strong password");
}

}

// ✅ A custom function to validate that only allowed fields are being edited in a user's profile
const validateEditProfile = (req) => {

  // ✅ List of fields that are allowed to be edited
  const allowedEditField = [
    "firstName",  // ✔️ first name can be edited
    "lastName",   // ✔️ last name can be edited
    "gender",     // ✔️ gender can be edited
    "age",        // ✔️ age can be edited
    "skills"       // ✔️ skill(s) can be edited
  ];

  // ✅ Check if every field in the request body is present in the allowed list
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditField.includes(field) // ✅ true if all requested fields are allowed
  );

  // ✅ Return true (valid) or false (invalid)
  return isEditAllowed;
};


module.exports={
     validateSignupData,
    validateEditProfile,
}