const express=require("express");
const userAuth=require("../middleware/auth")
const profileAuth=express.Router();
const {validateEditProfile}=require("../utlis/validation")



const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


profileAuth.get("/profile/view",userAuth, async(req,res)=>{
try{
  const user=req.user;
res.send(user);
}
catch(err){
  res.status(400).send("Error: "+err.message);
}
})

profileAuth.post("/profile/edit", userAuth, upload.single('profileImage'), async(req, res) => {
  try {
    const allowedEditField = [
      "firstName",
      "lastName", 
      "gender",
      "age",
      "skills",
      "about"
    ];

    const loggedInUser = req.user;
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    // Handle text fields from req.body
    Object.keys(req.body).forEach((key) => {
      if (allowedEditField.includes(key)) {
        if (key === 'skills') {
          // Parse skills if it's a JSON string
          try {
            loggedInUser[key] = JSON.parse(req.body[key]);
          } catch (e) {
            loggedInUser[key] = req.body[key];
          }
        } else {
          loggedInUser[key] = req.body[key];
        }
      }
    });

    // Handle file upload
    if (req.file) {
      // Store the file path in the database
      // You might want to store just the filename or full path depending on your setup
      loggedInUser.profileImage = `/uploads/profiles/${req.file.filename}`;
      
      // Optional: Delete old profile image file
      // if (loggedInUser.profileImage && loggedInUser.profileImage !== req.file.path) {
      //   const fs = require('fs');
      //   fs.unlink(loggedInUser.profileImage, (err) => {
      //     if (err) console.log('Error deleting old file:', err);
      //   });
      // }
    }

    await loggedInUser.save();
    
    res.json({
      message: `${loggedInUser.firstName}, your profile is updated successfully`,
      data: loggedInUser
    });

  } catch(err) {
    console.error("Profile update error:", err);
    res.status(400).send("Error: " + err.message);
  }
});




module.exports=profileAuth;