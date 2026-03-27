// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Replace 'username', 'password', and 'myDatabase' with your MongoDB Atlas credentials
mongoose.connect("mongodb://portfoliouser:ERS1210@ac-teisk8l-shard-00-00.qyqzsvy.mongodb.net:27017,ac-teisk8l-shard-00-01.qyqzsvy.mongodb.net:27017,ac-teisk8l-shard-00-02.qyqzsvy.mongodb.net:27017/eventDB?ssl=true&replicaSet=atlas-i8rene-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

// Simple root route to test backend
app.get("/", (req, res) => {
  res.send("Backend is live! 🚀");
});

// Register user
app.post("/register", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "All fields required" });

  try {
    const user = await User.create({ name, email });
    res.json({ message: "🎉 Saved to DB!", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Listen on Render's port or local
const PORT = process.env.PORT || 1012;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));