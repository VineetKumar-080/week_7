const express = require("express")
//importing modules from db.js file
const {UserModel, TodoModel} = require("./db")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const JWT_SECRET = "asddifad@12312"

mongoose.connect("mongodb+srv://Vineet_848:vineet_8.4e8@cluster0.o8botx2.mongodb.net/todo-app-database")

const app = express()
app.use(express.json())

// Signup Endpoint -- "Non-authenticated"
app.post("/signup",async function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email: email,
        password : password,
        name : name,
    })

    res.json({
        message: "You are logged in"
    })
})

// Signin Endpoint -- "Non-authenticated"
app.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password : password
    })

    console.log(user);
    
    if(user){
        const token = jwt.sign({
            id: user._id.toString()
        },JWT_SECRET)
        res.json({
            token: token
        })
    } else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
})

// Endpoint which user hits to create a todo in the database --- "Authenticated"
app.post("/todo",auth,function(req,res){
    const userID = req.userID
    const title = req.body.title;
    TodoModel.create({
        title,
        userID
    })
    res.json({
        userID : userID
    })
})

// Endpoint to get all the todos for a user -- "Authenticated"
app.get("/todos",auth,async function(req,res){
    const userID = req.userID
    const users = await TodoModel.find({
        userID : userID
    })

    res.json({
        userID : userID
    })
})

function auth(req,res,next){
    const token =  req.headers.token
    const decodeData =  jwt.verify(token,JWT_SECRET)

    if(decodeData){
        req.userID = decodeData.id;
        next()
    }else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
}

app.listen(3000)