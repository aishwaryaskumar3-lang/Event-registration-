const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// Replace password and database name as needed
mongoose.connect("mongodb+srv://portfoliouser:ERS1210@cluster0.qyqzsvy.mongodb.net/eventdb?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    event: String
});

const User = mongoose.model("User", userSchema);

// Routes

// Register a new user
app.post("/register", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json("Registered Successfully");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a user by ID
app.delete("/delete/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json("Deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});