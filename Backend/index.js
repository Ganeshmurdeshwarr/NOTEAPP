require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);



///Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "full name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: true, message: "Password required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) return res.json({ error: true, message: "User not found" });

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo },
      accesseToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30m",
      });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accesseToken,
    });
  } else
    res.status(400).json({
      error: true,
      message: "invalid credentials",
    });
});


// Get User 
app.get("/get-user", authenticateToken, async (req, res) => {
  const {user} = req.user;

  const isUser = await User.findOne({_id: user._id});

  if(!isUser){
    return res.sendStatus(401).json({
      error:true,
      message:"User not found"
    })
  }

  return res.json({
    user: {fullName :isUser.fullName,
      email:isUser.email,
      _id: isUser._id,
      createdOn:isUser.createdOn
},
    message:""
  })

});

// ADD NOTE

app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;

  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new ote({
      title,
      content,
      tags,
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

//Add Edit
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res.status(400).json({ error: true, message: "No change provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

// Get All Notes

app.get("/get-all-notes/", authenticateToken, async(req , res)=>{

  const {user} = req.user;

  try{
     const notes = await Note.find({userId:user._id}).sort({ isPinnued: -1})

     return res.json({
      error:false,
      notes,
      message:"Notes fetched successfully"
     })

  }catch(error){
    
    res.json({
      error:true,
      message:"Internal server Error"
    })
  }


})


//Delete Note

app.delete("/delete-note/:noteId", authenticateToken, async(req , res)=>{

  const noteId = req.params.noteId
  const {user} = req.user;

  try{
     const note = await Note.findOne({
      _id:noteId, userId:user._id
     })

     if(!note){
      return res.status(404).json({
        error:true,
        message:'note not found'
      })
     }
     await Note.deleteOne({
      _id:noteId , userId:user._id
     })

     return res.json({
      error:false,
      message:'note deleted successfully'
     })
  }catch(error){

    res.status(500).json({
      error:true,
      message:'Internal server',
    })
  }
})


//isPinned

app.put("/update-note-pinned/:noteId", authenticateToken, async(req , res)=>{

  const noteId = req.params.noteId;
  const {  isPinned } = req.body;
  const { user } = req.user;

 

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }
    
    note.isPinned = isPinned  ;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }

})


app.listen(8000);

module.exports = app;
