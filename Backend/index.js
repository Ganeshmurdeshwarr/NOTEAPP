require('dotenv').config();


const config = require('./config.json');
const mongoose = require('mongoose')

mongoose.connect(config.connectionString)

const User = require("./models/user.model")

const express = require('express');
const cors = require('cors');
const app= express();

const jwt = require("jsonwebtoken")
const {authenticateToken} = require("./utilities")

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.get('/', (req , res)=>{
    res.json({data : 'hello world'});
})

///Create Account 
 app.post('/create-account', async(req, res)=>{
    const {fullName, email, password} = req.body;

    if(!fullName ){
        return res.status(400).json({error:true, message:'full name is required'})    
    }
    if(!email ){
        return res.status(400).json({error:true, message:'Email is required'})    
    }
    if(!password ){
        return res.status(400).json({error:true, message:'Password required'})    
    }

    const isUser = await User.findOne({email:email})
    
    if(isUser){
        return res.json({
            error:true,
            message:'User already exists'
        })
    }

    const user = new User({
        fullName,
        email,
        password,
    })
    
    await user.save();

    const accessToken = jwt.sign({user},process.env.ACCESS_TOKEN_SECRET, {expiresIn:'30m'});

    return res.json({
        error:false,
        user,
        accessToken,
        message:'Registration Successful',
    });
 })


// Login
app.post('/login', async(req, res)=>{
    const {email , password }= req.body

    if(!email ){
        return res.status(400).json({error:true, message:'Email is required'})
    }
    if(!password ){
        return res.status(400).json({error:true, message:'password is required'})
    }

    const userInfo = await User.findOne({email:email})

    if(!userInfo) return res.json({error:true, message:'User not found'})

        if(userInfo.email == email && userInfo.password == password){
         const   user = {user : userInfo},

         accesseToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:'30m'
         } )

         return res.json({
            error:false,
            message:'Login Successful',
            email,
            accesseToken,
         })
        } else res.status(400).json({
            error:true,
            message:'invalid credentials',
        })

})

// ADD NOTE
















app.listen(8000);

module.exports = app