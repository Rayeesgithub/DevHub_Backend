const express=require("express");
const connectDB=require("./config/database");
const cookieParser = require("cookie-parser");

const app=express();

const cors=require("cors");
app.use(cors({
   origin: ["https://dev-hub-henna.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // ✅ include PATCH here
}));
app.use(express.json());
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user")
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/", userRouter);


connectDB()
 .then(()=>{
  const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
    console.log("Server running on port 3000");
});

    console.log("✅ MongoDB connected successfully")
 })
    .catch((err)=>{
     console.error("❌ MongoDB connection failed:", err.message);
    })
