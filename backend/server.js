const express = require("express")
const app = express()
const port = 3000
const cors = require("cors")
const User = require("./model/user.model")
const bcrypt = require("bcrypt")
// const User = require("./model/user.model")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")



// middleware to verify token
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token

    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }

    try {
        const decoded = jwt.verify(token, "secretkey")
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}
const connectedtodb = async () => {


    try {
        mongoose.connect("mongodb://localhost:27017/backend")
        console.log("db connected suceessfully")
    } catch (error) {
        console.log("error connecting db ")
    }

}


connectedtodb()




app.use(express.json())

app.use(cors({
    origin: "http://localhost:5174",
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}))

app.get("/", (req, res) => {
    res.send("server is running on port 3000")
})



// get post delete put patch



// {
// method : "POST",
// body : {
//     username : "John",
//     email : "john@example.com",
//     password : "123456"
// }
// }


app.post("/api/register", async (req, res) => {

    console.log(" [POST ]incoming register request ")
    const { username, email, password } = req.body


    console.log(`username: ${username}, email: ${email}, password: ${password}`)

    if (!username || !email || !password) {

        return res.status(400).json({ message: "All fields are required" })
    }


    // if user already exists, return an error

    const user = await User.findOne({ email: email })
    console.log(`user: ${user}`)
    if (user) {
        console.log("User already exists")
        return res.status(400).json({ message: "User already exists" })
    }


    // hash passoword

    const hasedPassword = await bcrypt.hash(password, 10)

    console.log(`hasedPassword: ${hasedPassword}`)

    // create user object in database

    const newuser = new User({

        username,
        email,
        password: hasedPassword,

    })

    console.log(`newuser: ${newuser}`)

    newuser.save()


    // sign the token 

    const token = jwt.sign({ id: newuser._id }, "secretkey", { expiresIn: "1h" })

    console.log(`token: ${token}`)
    res.cookie("token", token,
        // {httpOnly: true, secure: true, maxAge: 3600000} options 
    )



    // send the token to the client

    console.log(" [POST ]sending token to the client ")
    console.log(username, email, password)
    console.log(`sending user: ${newuser}`)
    return res.status(201).json({ message: "User created successfully", user: newuser })




})


app.post("/api/login", async (req, res) => {

    console.log(" [POST ]incoming login request ")

    const { email, password } = req.body

    console.log(email, password)


    if (!email || !password) {
        return res.status(400).json({ message: "all fileds are required.." })
    }

    const findemail = await User.findOne({ email })

    console.log(`findemail: ${findemail}`)
    if (!findemail) {
        return res.status(404).json({ message: "Email is wrong try again " })
    }

    const matchpassword = await bcrypt.compare(password, findemail.password)

    console.log(`matchpassword: ${matchpassword}`)
    if (!matchpassword) {
        return res.status(400).json({ message: "passoword is wrong " })
    }

    const token = jwt.sign({ id: findemail._id }, "secretkey", { expiresIn: "1h" })

    console.log(`setting token: ${token}`)

    res.cookie("token", token)

    console.log(`setting cookie: ${token}`)


    console.log(findemail, " user logged in succesfuully")

    return res.status(200).json({ message: "user login successsfully " })



})

app.get("/api/user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ user })
    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
})

// 200 - success
// 201  - created
// 400 - bad request
// 401 - unauthorized
// 403 - forbidden
// 404 - not found
// 500 - internal server error



// 502 - bad gateway
// 503 - service unavailable
// 504 - gateway timeout
// 505 - http version not supported
// 506 - variant also negotiates
// 507 - insufficient storage
// 508 - loop detected





app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})