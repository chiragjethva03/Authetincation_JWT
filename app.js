const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Login = require("./models/login");
const Register = require("./models/signup.js");
const session = require("express-session");
const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");
const flash = require("connect-flash"); 

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));


const sessionOption = {
    // store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}


main()
    .then(() => {
        console.log("connections Established");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/jwt_authentication');
}
//for the cookie passing 
app.use(session(sessionOption));
// app.use(flash());

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// });

const maxAge = 2 * 30 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, {
        expiresIn: maxAge
    });
}


app.get("/registration", (req, res) => {
    res.render("registration.ejs");
});

app.post("/registration", async (req, res) => {
    let {username, email, password} = req.body;
    try{
        let existingUser = await Register.findOne({username: username, email: email});
        if(existingUser){
            // req.flash("error", "that user can already register please try to Login")
            return res.redirect("/login")
        }
        let user = await Register.create({username, email, password});  
        const token = createToken(Register._id);
        res.cookie(username, token, { httpOnly: true, maxAge: maxAge * 1000});
        res.redirect("/login");
    }
    catch(err){
        console.log(err);
    }
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.post("/login", (req, res) => {
    let {email, password} = req.body;
    console.log(email, password);
    res.send("login successfully"); 
})

app.get("/", (req, res) => {
    res.send("well"); 
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server start on port number ${PORT}`);
})