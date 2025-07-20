// Import required modules
const exprees = require("express");
const userAuth = require("../middleware/auth"); // ✅ middleware to check if user is logged in
const ConnectionRequest = require("../model/connectionRequest"); // ✅ connection request model
const User = require("../model/user"); // ✅ user model

// Create a new Express Router
const userRouter = exprees.Router();

// ✅ GET request: View all received connection requests with status "interested"
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    // Get the logged-in user from auth middleware
    const loggedInUser = req.user;

    // Fetch all requests where this user is the receiver and request status is "interested"
    const connctionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested"
    }).populate("formUserId", "firstName lastName about skills profileImage"); // ✅ Populate only first & last name of sender

    // Send the fetched data
    res.json({
      message: "fetched received Connection Successfully",
      data: connctionRequest
    });
  } catch (err) {
    res.status(400).send("error: " + err.message);
  }
});


// ✅ GET request: Show all users who are connected (accepted requests)
userRouter.get("/user/connection", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  try {
    // Find all accepted connection requests involving current user (either as sender or receiver)
    const connctionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { formUserId: loggedInUser._id, status: "accepted" }
      ],
    })
      .populate("formUserId", "firstName lastName gender age skills about profileImage")
      .populate("toUserId", "firstName lastName");

    // Extract only the connected user's info (i.e., not the logged-in user)
    const data = connctionRequest.map((it) => {
      if (it.formUserId._id.toString() === loggedInUser._id.toString()) {
        return it.toUserId;
      }
      return it.formUserId;
    });

    res.json({
      message: "Connection list:",
      data,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});


// ✅ GET request: Recommendation Feed – Suggest users not already connected
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Get pagination params from query, default: page 1, limit 10
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 45;
    limit = limit > 50 ? 50 : limit; // Max limit is 50
    const skip = (page - 1) * limit;

    // Get all connection requests (both sent and received) involving the user
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { formUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    })
      .populate("formUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    // Build a set of users already involved in any connection with the user
    const hiddenFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hiddenFromFeed.add(req.formUserId); // sender
      hiddenFromFeed.add(req.toUserId);   // receiver
    });

    // Now find users who are not already connected and not the logged-in user
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenFromFeed) } }, // not in connection
        { _id: { $ne: loggedInUser._id } },             // not self
      ]
    })
      .select("-password -emailId") // Return only basic info
      .skip(skip) // Apply pagination
      .limit(limit);

    // Send the recommended users
    res.json({
      message: "Recommended Feed except user from your connection",
      data: user
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


// Export router to be used in app.js
module.exports = userRouter;