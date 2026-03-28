const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.mongodb+srv://portfoliouser:ERS1210@cluster0.qyqzsvy.mongodb.net/?appName=Cluster0)
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

// Register
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
    const users = await User.find();
    res.json(users);
});

// Delete user
app.delete("/delete/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json("Deleted");
});

// PORT (IMPORTANT for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});