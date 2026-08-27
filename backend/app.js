const dotenv = require('dotenv').config()
const authMiddleware=require('./middleware/authMiddleware')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 
const adminMiddleware=require('./middleware/adminMiddleware')

const app = express()
app.use(express.json())
app.use(cors())

//schema design
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log('mongoDb connected')
})
.catch((err)=>{
    console.log('mongoDb not connected')
    console.log(err)
})

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    }
})
const User = mongoose.model("User",userSchema)

app.post('/signup',async (req,res)=>{
    const {username,password,role} = req.body
    const hashedpwd = await bcrypt.hash(password,10)

    await User.create({
        username:username,
        password:hashedpwd,
        role:role || "user"
    })
    res.send('user inserted successfully')
})

app.post('/login',async (req,res)=>{
    const {username,password} = req.body

    const user = await User.findOne({username})

    if(!user)
    {
        return res.send({message:'User not found'})
    }

    const isMatch = await bcrypt.compare(password,user.password)
    
    if(!isMatch)
    {
        return res.send({message:'Password Incorrect'})
    }

    const token = jwt.sign(
        {
            username:user.username,
            role:user.role
        },
        process.env.JWT_SECRETKEY
    )

    res.send({
        message:"Login Successfull",
        token
    })
})

app.get('/profile',authMiddleware,(req,res)=>{
    
    res.send("profile fetched successfully")
})

app.get('/dashboard',authMiddleware,(req,res)=>{
    
    res.send("Dashboard Route")   
})


app.get('/admin',authMiddleware,adminMiddleware,async(req,res)=>{
    const users = await User.find()

    res.json(users)
})

app.delete('/admin/:id',authMiddleware,adminMiddleware,async(req,res)=>{
    await User.findByIdAndDelete(req.params.id)

    res.send({message:"user deleted"})
})

//hosting
app.listen(process.env.PORT,()=>{
    console.log("Server Connected")
})