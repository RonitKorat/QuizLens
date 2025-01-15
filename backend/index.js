const express = require("express");
const app = express();
const User = require("./db/user");
require("./db/config");
const cors=require("cors");
const { default: mongoose } = require("mongoose");

app.use(express.json());
app.use(cors());

// app.get("/",async (req,res)=>{
//   const result=await User.find();
//   res.send(result);
// })



app.post("/signup", async (req, res) => {
  let user = new User(req.body);
  user =await user.save()
  res.send(user);
});

app.post("/signin", async (req, res) => {
  let email=req.body.email;
  let password=req.body.password;
  const user=await User.findOne({email,password});
  if(!user)
  {
    return res.status(400).json({message:"User not found"});
  }
  else
  {
    return res.status(200).json({message:"Login Success",user});
  }
});

app.listen(2200);
