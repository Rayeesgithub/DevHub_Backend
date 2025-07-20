const express = require("express");
const User = require("../model/user"); // Your User model
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail"); // You can implement this using nodemailer
const router = express.Router();

router.post("/forgot", async (req, res) => {
  try {
    const { emailId } = req.body;

    // ✅ 1. Check if the user exists
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // ✅ 2. Generate a reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
      { _id: user._id },
      "Rayees@3457", // Store in .env
      { expiresIn: "15m" }
    );

    // ✅ 3. Send token to user's email (fake endpoint or console for now)
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // You can send it using nodemailer (placeholder here)
    await sendEmail(emailId, "Reset your password", `Click here: ${resetLink}`);

    res.send("Reset password link sent to your email.");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = router;
