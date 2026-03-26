const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://portfoliouser:Ash1210@ac-teisk8l-shard-00-00.qyqzsvy.mongodb.net:27017,ac-teisk8l-shard-00-01.qyqzsvy.mongodb.net:27017,ac-teisk8l-shard-00-02.qyqzsvy.mongodb.net:27017/?ssl=true&replicaSet=atlas-i8rene-shard-0&authSource=admin&appName=Cluster0")
.then(()=>console.log("DB connected"))
.catch(err=>console.log(err));

const userSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.json({ message: "All fields required" });
  }

  await User.create({ name, email });
  res.json({ message: "🎉 Saved to DB!" });
});

app.get("/users", async (req, res) => {
  const data = await User.find();
  res.json(data);
});

app.listen(1012, () => console.log("🚀 Server running on port 1012"));
