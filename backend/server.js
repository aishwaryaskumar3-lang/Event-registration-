const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://portfoliouser:ERS1210@cluster0.qyqzsvy.mongodb.net/eventDB?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    event: String
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/register", async (req, res) => {
  try {
    console.log("Register request received:", req.body);
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    console.log("Saved user:", savedUser);
    res.status(200).json({ message: "Registered Successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});