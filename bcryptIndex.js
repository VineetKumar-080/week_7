const bcrypt = require("bcrypt");

const express = require("express")
//importing modules from db.js file
const {UserModel, TodoModel} = require("./db")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const JWT_SECRET = "asddifad@12312"
const { z } = require("zod")

mongoose.connect("mongodb+srv://Vineet_848:vineet_8.4e8@cluster0.o8botx2.mongodb.net/todos-app-week-7-2")

const app = express()
app.use(express.json())

// Signup Endpoint -- "Non-authenticated"

// we should add validation checks (ZOD) to the top of the routes 
app.post("/signup",async function(req,res){

    // here we are using ZOD for validation checks
    /**
     * 1st we define the schema
     * 2nd we parse the data
     */

    // defining the schema
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        name: z.string().min(3).max(100),
        password: z.string().min(3).max(30)
    })

    // parsing the data.
    /**
     * to parse the data we have 2 functions
     * 1. parse - either succeed or throw an error
     * 2. safeparse - either succedd or tell what's the error
     */

    // const parsedData = requiredBody.parse(req.body)
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    // {
    //     success : true | false,
    //     data : {},
    //     errors : []
    // }

    if(parsedDataWithSuccess.success){
        res.json({
            message: "Incorrect format",
            error : parsedDataWithSuccess.error
        })
        return
    }



    const email = req.body.email; // string
    const password = req.body.password; // string
    const name = req.body.name; //  string 

    // Hashing the password before storing it in the database.

    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);
    

    await UserModel.create({
        email: email,
        password : hashedPassword,
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
    })

    if(!user){
        res.status(403).json({
            message: "User does not exist in our database"
        })
        return
    }

    // using bcrypt.compare to compare the passwords and let the user sign-in
    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if(passwordMatch){
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