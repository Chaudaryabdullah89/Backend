const express = require("express")
const app = express()
const port = 3000
const cors = require("cors")
const User = require("./model/user.model")
const bcrypt = require("bcrypt")
// const User = require("./model/user.model")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

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
    const { username, email, password } = req.body


    if (!username || !email || !password) {

        return res.status(400).json({ message: "All fields are required" })
    }


    // if user already exists, return an error

    const user = await User.findOne({ email: email })
    if (user) {
        return res.status(400).json({ message: "User already exists" })
    }


    // hash passoword

    const hasedPassword = await bcrypt.hash(password, 10)



    // create user object in database

    const newuser = new User({

        username,
        email,
        password: hasedPassword,

    })

    newuser.save()


    // sign the token 

    const token = jwt.sign({ id: newuser._id }, "secretkey", { expiresIn: "1h" })


    res.cookie("token", token,
        // {httpOnly: true, secure: true, maxAge: 3600000} options 
    )



    // send the token to the client


    console.log(username, email, password)
    res.status(201).json({ message: "User created successfully", user: newuser })




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